from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import re
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Annotated

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends, Query
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict, BeforeValidator

from seed_data import SEED_PRODUCTS, CATEGORIES


# ---------- Setup ----------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="BharatMart API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("bharatmart")

JWT_ALGORITHM = "HS256"
JWT_SECRET = os.environ["JWT_SECRET"]


# ---------- Helpers ----------
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie("access_token", access_token, httponly=True, secure=False,
                        samesite="lax", max_age=86400, path="/")
    response.set_cookie("refresh_token", refresh_token, httponly=True, secure=False,
                        samesite="lax", max_age=604800, path="/")


def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


def user_to_public(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name", ""),
        "role": user.get("role", "user"),
    }


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ---------- Models ----------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProductOut(BaseModel):
    id: str
    name: str
    brand: str
    category: str
    price: int
    original_price: int
    discount: int
    rating: float
    rating_count: int
    description: str
    features: List[str]
    images: List[str]
    stock: int
    is_bestseller: bool = False
    is_new: bool = False


class CartItemIn(BaseModel):
    product_id: str
    quantity: int = Field(ge=1, default=1)


class CartUpdateIn(BaseModel):
    quantity: int = Field(ge=1)


class ReviewIn(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str = Field(min_length=1)


class AddressIn(BaseModel):
    full_name: str
    phone: str
    line1: str
    line2: Optional[str] = ""
    city: str
    state: str
    pincode: str
    country: str = "India"


class CheckoutIn(BaseModel):
    address: AddressIn
    payment_method: str = "COD"


# ---------- Product helpers ----------
def enrich_product(p: dict) -> dict:
    discount = 0
    if p.get("original_price") and p["original_price"] > p["price"]:
        discount = round((1 - p["price"] / p["original_price"]) * 100)
    return {**p, "discount": discount}


# ---------- AUTH ROUTES ----------
@api_router.post("/auth/register")
async def register(body: RegisterRequest, response: Response):
    email = body.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    doc = {
        "email": email,
        "password_hash": hash_password(body.password),
        "name": body.name,
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await db.users.insert_one(doc)
    user_id = str(result.inserted_id)
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    set_auth_cookies(response, access, refresh)
    return {"user": {"id": user_id, "email": email, "name": body.name, "role": "user"},
            "token": access}


@api_router.post("/auth/login")
async def login(body: LoginRequest, response: Response):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    user_id = str(user["_id"])
    access = create_access_token(user_id, email)
    refresh = create_refresh_token(user_id)
    set_auth_cookies(response, access, refresh)
    return {"user": user_to_public(user), "token": access}


@api_router.post("/auth/logout")
async def logout(response: Response):
    clear_auth_cookies(response)
    return {"success": True}


@api_router.get("/auth/me")
async def me(user: dict = Depends(get_current_user)):
    return user_to_public(user)


# ---------- PRODUCT ROUTES ----------
@api_router.get("/categories")
async def list_categories():
    counts = {}
    async for p in db.products.find({}, {"category": 1}):
        counts[p["category"]] = counts.get(p["category"], 0) + 1
    result = []
    for cat in CATEGORIES:
        result.append({**cat, "count": counts.get(cat["name"], 0)})
    return result


@api_router.get("/products")
async def list_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    brand: Optional[str] = None,
    min_rating: Optional[float] = None,
    sort: Optional[str] = Query("popularity", pattern="^(popularity|price_asc|price_desc|rating|newest)$"),
    limit: int = Query(60, ge=1, le=200),
    skip: int = Query(0, ge=0),
):
    query: dict = {}
    if category:
        # match by slug or name (case-insensitive)
        cat_match = next((c for c in CATEGORIES if c["slug"] == category.lower() or c["name"].lower() == category.lower()), None)
        query["category"] = cat_match["name"] if cat_match else category
    if search:
        regex = re.compile(re.escape(search), re.IGNORECASE)
        query["$or"] = [{"name": regex}, {"brand": regex}, {"description": regex}]
    if brand:
        query["brand"] = brand
    price_filter = {}
    if min_price is not None:
        price_filter["$gte"] = min_price
    if max_price is not None:
        price_filter["$lte"] = max_price
    if price_filter:
        query["price"] = price_filter
    if min_rating is not None:
        query["rating"] = {"$gte": min_rating}

    sort_map = {
        "popularity": [("rating_count", -1)],
        "price_asc": [("price", 1)],
        "price_desc": [("price", -1)],
        "rating": [("rating", -1)],
        "newest": [("is_new", -1), ("rating_count", -1)],
    }

    cursor = db.products.find(query, {"_id": 0}).sort(sort_map[sort or "popularity"]).skip(skip).limit(limit)
    products = [enrich_product(p) async for p in cursor]
    total = await db.products.count_documents(query)
    return {"products": products, "total": total}


@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    p = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return {"product": enrich_product(p), "reviews": reviews}


@api_router.get("/products/{product_id}/reviews")
async def get_reviews(product_id: str):
    reviews = await db.reviews.find({"product_id": product_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return reviews


@api_router.post("/products/{product_id}/reviews")
async def add_review(product_id: str, body: ReviewIn, user: dict = Depends(get_current_user)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    review = {
        "id": str(uuid.uuid4()),
        "product_id": product_id,
        "user_id": str(user["_id"]),
        "user_name": user.get("name", "User"),
        "rating": body.rating,
        "comment": body.comment,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.reviews.insert_one(review)
    review.pop("_id", None)
    return review


# ---------- CART ROUTES ----------
async def _get_cart_doc(user_id: str) -> dict:
    doc = await db.carts.find_one({"user_id": user_id})
    if not doc:
        doc = {"user_id": user_id, "items": []}
        await db.carts.insert_one(doc)
    return doc


async def _populate_cart(items: List[dict]) -> dict:
    detailed = []
    subtotal = 0
    for it in items:
        p = await db.products.find_one({"id": it["product_id"]}, {"_id": 0})
        if not p:
            continue
        p = enrich_product(p)
        line_total = p["price"] * it["quantity"]
        subtotal += line_total
        detailed.append({"product": p, "quantity": it["quantity"], "line_total": line_total})
    shipping = 0 if subtotal >= 500 or subtotal == 0 else 49
    total = subtotal + shipping
    return {"items": detailed, "subtotal": subtotal, "shipping": shipping, "total": total}


@api_router.get("/cart")
async def get_cart(user: dict = Depends(get_current_user)):
    cart = await _get_cart_doc(str(user["_id"]))
    return await _populate_cart(cart.get("items", []))


@api_router.post("/cart/items")
async def add_to_cart(body: CartItemIn, user: dict = Depends(get_current_user)):
    product = await db.products.find_one({"id": body.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    cart = await _get_cart_doc(str(user["_id"]))
    items = cart.get("items", [])
    existing = next((i for i in items if i["product_id"] == body.product_id), None)
    if existing:
        existing["quantity"] += body.quantity
    else:
        items.append({"product_id": body.product_id, "quantity": body.quantity})
    await db.carts.update_one({"user_id": str(user["_id"])}, {"$set": {"items": items}})
    return await _populate_cart(items)


@api_router.patch("/cart/items/{product_id}")
async def update_cart_item(product_id: str, body: CartUpdateIn, user: dict = Depends(get_current_user)):
    cart = await _get_cart_doc(str(user["_id"]))
    items = cart.get("items", [])
    found = False
    for i in items:
        if i["product_id"] == product_id:
            i["quantity"] = body.quantity
            found = True
            break
    if not found:
        raise HTTPException(status_code=404, detail="Item not in cart")
    await db.carts.update_one({"user_id": str(user["_id"])}, {"$set": {"items": items}})
    return await _populate_cart(items)


@api_router.delete("/cart/items/{product_id}")
async def remove_cart_item(product_id: str, user: dict = Depends(get_current_user)):
    cart = await _get_cart_doc(str(user["_id"]))
    items = [i for i in cart.get("items", []) if i["product_id"] != product_id]
    await db.carts.update_one({"user_id": str(user["_id"])}, {"$set": {"items": items}})
    return await _populate_cart(items)


@api_router.delete("/cart")
async def clear_cart(user: dict = Depends(get_current_user)):
    await db.carts.update_one({"user_id": str(user["_id"])}, {"$set": {"items": []}})
    return await _populate_cart([])


# ---------- WISHLIST ROUTES ----------
@api_router.get("/wishlist")
async def get_wishlist(user: dict = Depends(get_current_user)):
    doc = await db.wishlists.find_one({"user_id": str(user["_id"])})
    ids = doc.get("product_ids", []) if doc else []
    products = []
    for pid in ids:
        p = await db.products.find_one({"id": pid}, {"_id": 0})
        if p:
            products.append(enrich_product(p))
    return {"products": products}


@api_router.post("/wishlist/{product_id}")
async def add_to_wishlist(product_id: str, user: dict = Depends(get_current_user)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.wishlists.update_one(
        {"user_id": str(user["_id"])},
        {"$addToSet": {"product_ids": product_id}},
        upsert=True,
    )
    return {"success": True}


@api_router.delete("/wishlist/{product_id}")
async def remove_from_wishlist(product_id: str, user: dict = Depends(get_current_user)):
    await db.wishlists.update_one(
        {"user_id": str(user["_id"])},
        {"$pull": {"product_ids": product_id}},
    )
    return {"success": True}


# ---------- ORDER ROUTES ----------
@api_router.post("/orders")
async def create_order(body: CheckoutIn, user: dict = Depends(get_current_user)):
    cart = await _get_cart_doc(str(user["_id"]))
    items = cart.get("items", [])
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    populated = await _populate_cart(items)
    order = {
        "id": str(uuid.uuid4()),
        "user_id": str(user["_id"]),
        "user_email": user["email"],
        "items": [
            {
                "product_id": it["product"]["id"],
                "name": it["product"]["name"],
                "brand": it["product"]["brand"],
                "image": it["product"]["images"][0] if it["product"]["images"] else "",
                "price": it["product"]["price"],
                "quantity": it["quantity"],
                "line_total": it["line_total"],
            }
            for it in populated["items"]
        ],
        "subtotal": populated["subtotal"],
        "shipping": populated["shipping"],
        "total": populated["total"],
        "address": body.address.model_dump(),
        "payment_method": body.payment_method,
        "status": "confirmed",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.orders.insert_one(order)
    await db.carts.update_one({"user_id": str(user["_id"])}, {"$set": {"items": []}})
    order.pop("_id", None)
    return order


@api_router.get("/orders")
async def list_orders(user: dict = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": str(user["_id"])}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return {"orders": orders}


@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, user: dict = Depends(get_current_user)):
    order = await db.orders.find_one({"id": order_id, "user_id": str(user["_id"])}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# ---------- Register router & CORS ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.environ.get('CORS_ORIGINS', '').split(',') if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Startup: seed products + admin ----------
@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.products.create_index("id", unique=True)
    await db.orders.create_index("user_id")
    await db.reviews.create_index("product_id")
    await db.carts.create_index("user_id", unique=True)
    await db.wishlists.create_index("user_id", unique=True)

    # Seed products (idempotent)
    for product in SEED_PRODUCTS:
        await db.products.update_one({"id": product["id"]}, {"$set": product}, upsert=True)
    logger.info(f"Seeded {len(SEED_PRODUCTS)} products.")

    # Seed sample reviews
    review_count = await db.reviews.count_documents({})
    if review_count == 0:
        sample_reviews = [
            {"product_id": "iphone-15-pro", "user_name": "Rahul S.", "rating": 5,
             "comment": "Camera is insane! Titanium feels premium. Best iPhone I've owned."},
            {"product_id": "iphone-15-pro", "user_name": "Priya M.", "rating": 4,
             "comment": "Great phone but expensive. Battery life could be better."},
            {"product_id": "boat-airdopes-141", "user_name": "Amit K.", "rating": 4,
             "comment": "Excellent value for money. Bass is punchy."},
            {"product_id": "sony-wh1000xm5", "user_name": "Neha P.", "rating": 5,
             "comment": "Best noise cancelling I have used. Perfect for flights."},
            {"product_id": "atomic-habits", "user_name": "Vikram J.", "rating": 5,
             "comment": "Life-changing book. Actionable insights on every page."},
            {"product_id": "wings-of-fire", "user_name": "Sneha R.", "rating": 5,
             "comment": "Every Indian should read this. Truly inspiring."},
        ]
        for r in sample_reviews:
            r["id"] = str(uuid.uuid4())
            r["user_id"] = "seed"
            r["created_at"] = datetime.now(timezone.utc).isoformat()
        await db.reviews.insert_many(sample_reviews)
        logger.info(f"Seeded {len(sample_reviews)} sample reviews.")

    # Seed admin + test user
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@bharatmart.in")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing_admin = await db.users.find_one({"email": admin_email})
    if not existing_admin:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Created admin: {admin_email}")
    elif not verify_password(admin_password, existing_admin["password_hash"]):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})

    test_email = os.environ.get("TEST_USER_EMAIL", "test@bharatmart.in")
    test_password = os.environ.get("TEST_USER_PASSWORD", "test123")
    existing_test = await db.users.find_one({"email": test_email})
    if not existing_test:
        await db.users.insert_one({
            "email": test_email,
            "password_hash": hash_password(test_password),
            "name": "Test User",
            "role": "user",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Created test user: {test_email}")
    elif not verify_password(test_password, existing_test["password_hash"]):
        await db.users.update_one({"email": test_email},
                                  {"$set": {"password_hash": hash_password(test_password)}})


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
