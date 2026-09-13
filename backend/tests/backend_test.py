"""
BharatMart Backend API tests - covers auth, products, cart, wishlist, orders, reviews.
"""
import os
import time
import uuid
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'http://localhost:8000').rstrip('/')
API = f"{BASE_URL}/api"

TEST_EMAIL = "test@bharatmart.in"
TEST_PASSWORD = "test123"


# ---------- Fixtures ----------
@pytest.fixture(scope="session")
def api_client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def auth_session():
    """Login as seeded test user; returns session with cookies + Bearer header."""
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    r = s.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"Cannot login seeded user: {r.status_code} {r.text}")
    token = r.json().get("token")
    s.headers.update({"Authorization": f"Bearer {token}"})
    return s


@pytest.fixture(scope="session")
def fresh_user():
    """Create a fresh registered user; returns session logged in."""
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    email = f"test_{uuid.uuid4().hex[:8]}@bharatmart.in"
    r = s.post(f"{API}/auth/register", json={"email": email, "password": "pass1234", "name": "TEST_User"})
    if r.status_code != 200:
        pytest.skip(f"Cannot register user: {r.status_code} {r.text}")
    token = r.json().get("token")
    s.headers.update({"Authorization": f"Bearer {token}"})
    s.email = email  # type: ignore
    return s


# ---------- Health / Catalog ----------
class TestCatalog:
    def test_categories_endpoint(self, api_client):
        r = api_client.get(f"{API}/categories")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) == 6
        slugs = [c["slug"] for c in data]
        for s in ["electronics", "fashion", "home-kitchen", "beauty", "books", "grocery"]:
            assert s in slugs
        # count should be > 0 for at least electronics
        elec = next(c for c in data if c["slug"] == "electronics")
        assert elec["count"] >= 1

    def test_products_list(self, api_client):
        r = api_client.get(f"{API}/products")
        assert r.status_code == 200
        data = r.json()
        assert "products" in data and "total" in data
        assert data["total"] >= 29
        p = data["products"][0]
        for k in ("id", "name", "brand", "category", "price", "original_price", "discount", "rating", "images"):
            assert k in p, f"missing key {k}"

    def test_products_category_filter(self, api_client):
        r = api_client.get(f"{API}/products", params={"category": "electronics"})
        assert r.status_code == 200
        data = r.json()
        assert data["total"] > 0
        for p in data["products"]:
            assert p["category"].lower() == "electronics"

    def test_products_search(self, api_client):
        r = api_client.get(f"{API}/products", params={"search": "iPhone"})
        assert r.status_code == 200
        data = r.json()
        assert data["total"] >= 1
        assert any("iphone" in p["name"].lower() for p in data["products"])

    def test_products_price_filter_and_sort(self, api_client):
        r = api_client.get(f"{API}/products", params={"min_price": 1000, "max_price": 5000, "sort": "price_asc"})
        assert r.status_code == 200
        products = r.json()["products"]
        assert len(products) > 0
        prices = [p["price"] for p in products]
        assert prices == sorted(prices)
        for pr in prices:
            assert 1000 <= pr <= 5000

    def test_products_sort_price_desc(self, api_client):
        r = api_client.get(f"{API}/products", params={"sort": "price_desc"})
        assert r.status_code == 200
        prices = [p["price"] for p in r.json()["products"]]
        assert prices == sorted(prices, reverse=True)

    def test_products_rating_filter(self, api_client):
        r = api_client.get(f"{API}/products", params={"min_rating": 4.5})
        assert r.status_code == 200
        for p in r.json()["products"]:
            assert p["rating"] >= 4.5

    def test_product_detail(self, api_client):
        r = api_client.get(f"{API}/products/iphone-15-pro")
        assert r.status_code == 200
        data = r.json()
        assert "product" in data and "reviews" in data
        assert data["product"]["id"] == "iphone-15-pro"
        assert data["product"]["discount"] > 0
        assert isinstance(data["reviews"], list)

    def test_product_detail_not_found(self, api_client):
        r = api_client.get(f"{API}/products/does-not-exist-xyz")
        assert r.status_code == 404


# ---------- Auth ----------
class TestAuth:
    def test_login_success_seeded_user(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": TEST_PASSWORD})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["user"]["email"] == TEST_EMAIL
        assert isinstance(data.get("token"), str) and len(data["token"]) > 0
        # cookies should be set
        assert "access_token" in r.cookies or any(c.name == "access_token" for c in r.cookies)

    def test_login_invalid(self, api_client):
        r = api_client.post(f"{API}/auth/login", json={"email": TEST_EMAIL, "password": "wrongpass"})
        assert r.status_code == 401

    def test_register_and_auto_login(self, api_client):
        email = f"test_{uuid.uuid4().hex[:8]}@bharatmart.in"
        r = api_client.post(f"{API}/auth/register", json={"email": email, "password": "pass1234", "name": "TEST_New"})
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["user"]["email"] == email
        assert data["user"]["name"] == "TEST_New"
        assert data.get("token")

    def test_register_duplicate(self, api_client):
        r = api_client.post(f"{API}/auth/register", json={"email": TEST_EMAIL, "password": "pass1234", "name": "Dup"})
        assert r.status_code == 400

    def test_me_requires_auth(self):
        # Use fresh session to avoid session-scoped cookie leak
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_returns_user(self, auth_session):
        r = auth_session.get(f"{API}/auth/me")
        assert r.status_code == 200
        data = r.json()
        assert data["email"] == TEST_EMAIL

    def test_logout(self, auth_session):
        # Save headers, then logout
        r = auth_session.post(f"{API}/auth/logout")
        assert r.status_code == 200
        assert r.json().get("success") is True


# ---------- Cart ----------
class TestCart:
    def test_cart_requires_auth(self):
        r = requests.get(f"{API}/cart")
        assert r.status_code == 401

    def test_add_and_get_cart(self, fresh_user):
        r = fresh_user.post(f"{API}/cart/items", json={"product_id": "boat-airdopes-141", "quantity": 2})
        assert r.status_code == 200, r.text
        data = r.json()
        assert len(data["items"]) == 1
        assert data["items"][0]["quantity"] == 2
        # subtotal = 1299 * 2 = 2598; >= 500 -> shipping 0
        assert data["subtotal"] == 2598
        assert data["shipping"] == 0
        assert data["total"] == 2598

    def test_shipping_below_500(self, fresh_user):
        # Clear cart first
        fresh_user.delete(f"{API}/cart")
        r = fresh_user.post(f"{API}/cart/items", json={"product_id": "tata-salt", "quantity": 1})
        assert r.status_code == 200
        data = r.json()
        assert data["subtotal"] == 28
        assert data["shipping"] == 49
        assert data["total"] == 77

    def test_update_cart_qty(self, fresh_user):
        fresh_user.delete(f"{API}/cart")
        fresh_user.post(f"{API}/cart/items", json={"product_id": "milton-thermosteel", "quantity": 1})
        r = fresh_user.patch(f"{API}/cart/items/milton-thermosteel", json={"quantity": 3})
        assert r.status_code == 200
        data = r.json()
        assert data["items"][0]["quantity"] == 3
        assert data["subtotal"] == 799 * 3

    def test_remove_cart_item(self, fresh_user):
        fresh_user.delete(f"{API}/cart")
        fresh_user.post(f"{API}/cart/items", json={"product_id": "amul-butter", "quantity": 1})
        r = fresh_user.delete(f"{API}/cart/items/amul-butter")
        assert r.status_code == 200
        assert len(r.json()["items"]) == 0

    def test_add_invalid_product(self, fresh_user):
        r = fresh_user.post(f"{API}/cart/items", json={"product_id": "no-such-id", "quantity": 1})
        assert r.status_code == 404


# ---------- Wishlist ----------
class TestWishlist:
    def test_wishlist_requires_auth(self):
        r = requests.get(f"{API}/wishlist")
        assert r.status_code == 401

    def test_add_get_remove_wishlist(self, fresh_user):
        r = fresh_user.post(f"{API}/wishlist/atomic-habits")
        assert r.status_code == 200
        r = fresh_user.get(f"{API}/wishlist")
        assert r.status_code == 200
        products = r.json()["products"]
        assert any(p["id"] == "atomic-habits" for p in products)
        # idempotent add
        r = fresh_user.post(f"{API}/wishlist/atomic-habits")
        assert r.status_code == 200
        r = fresh_user.get(f"{API}/wishlist")
        ids = [p["id"] for p in r.json()["products"]]
        assert ids.count("atomic-habits") == 1
        # remove
        r = fresh_user.delete(f"{API}/wishlist/atomic-habits")
        assert r.status_code == 200
        r = fresh_user.get(f"{API}/wishlist")
        assert not any(p["id"] == "atomic-habits" for p in r.json()["products"])


# ---------- Reviews ----------
class TestReviews:
    def test_get_reviews_public(self, api_client):
        r = api_client.get(f"{API}/products/iphone-15-pro/reviews")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_add_review_requires_auth(self):
        r = requests.post(f"{API}/products/iphone-15-pro/reviews", json={"rating": 5, "comment": "great"})
        assert r.status_code == 401

    def test_add_review(self, fresh_user):
        payload = {"rating": 4, "comment": f"TEST review {uuid.uuid4().hex[:6]}"}
        r = fresh_user.post(f"{API}/products/atomic-habits/reviews", json=payload)
        assert r.status_code == 200, r.text
        review = r.json()
        assert review["rating"] == 4
        assert review["comment"] == payload["comment"]
        # ObjectId should be excluded
        assert "_id" not in review
        # verify persistence
        r2 = fresh_user.get(f"{API}/products/atomic-habits/reviews")
        assert r2.status_code == 200
        assert any(rv["comment"] == payload["comment"] for rv in r2.json())

    def test_add_review_invalid_rating(self, fresh_user):
        r = fresh_user.post(f"{API}/products/atomic-habits/reviews", json={"rating": 6, "comment": "bad"})
        assert r.status_code == 422


# ---------- Orders (Checkout) ----------
class TestOrders:
    def test_orders_requires_auth(self):
        r = requests.get(f"{API}/orders")
        assert r.status_code == 401

    def test_checkout_empty_cart(self, fresh_user):
        fresh_user.delete(f"{API}/cart")
        addr = {
            "full_name": "TEST User", "phone": "9999999999",
            "line1": "1 Test St", "city": "Mumbai", "state": "MH", "pincode": "400001"
        }
        r = fresh_user.post(f"{API}/orders", json={"address": addr, "payment_method": "COD"})
        assert r.status_code == 400

    def test_full_checkout_flow(self, fresh_user):
        # add items
        fresh_user.delete(f"{API}/cart")
        fresh_user.post(f"{API}/cart/items", json={"product_id": "boat-airdopes-141", "quantity": 1})
        fresh_user.post(f"{API}/cart/items", json={"product_id": "wings-of-fire", "quantity": 2})
        # get cart
        cart_r = fresh_user.get(f"{API}/cart")
        expected_total = cart_r.json()["total"]

        addr = {
            "full_name": "TEST User", "phone": "9999999999",
            "line1": "1 Test St", "line2": "", "city": "Mumbai",
            "state": "MH", "pincode": "400001"
        }
        r = fresh_user.post(f"{API}/orders", json={"address": addr, "payment_method": "UPI"})
        assert r.status_code == 200, r.text
        order = r.json()
        assert order["status"] == "confirmed"
        assert order["payment_method"] == "UPI"
        assert order["total"] == expected_total
        assert len(order["items"]) == 2
        assert "_id" not in order
        order_id = order["id"]

        # cart should be empty
        cart = fresh_user.get(f"{API}/cart").json()
        assert cart["items"] == []

        # order should be retrievable
        r2 = fresh_user.get(f"{API}/orders/{order_id}")
        assert r2.status_code == 200
        assert r2.json()["id"] == order_id

        # list orders
        r3 = fresh_user.get(f"{API}/orders")
        assert r3.status_code == 200
        orders = r3.json()["orders"]
        assert any(o["id"] == order_id for o in orders)

    def test_order_not_found(self, fresh_user):
        r = fresh_user.get(f"{API}/orders/nonexistent-order-id")
        assert r.status_code == 404
