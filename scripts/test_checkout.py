import urllib.request
import json
import sqlite3

# 1. Get a product
conn = sqlite3.connect("prisma/dev.db")
c = conn.cursor()
c.execute("SELECT id, name, price FROM Product LIMIT 1")
prod = c.fetchone()
conn.close()
prod_id, prod_name, price = prod
print(f"Testing product: {prod_name} (ID: {prod_id}, Price: {price})")

# 2. Initialize checkout
checkout_data = json.dumps({
    "productId": prod_id,
    "customerEmail": "test@healingandgrowth.com",
    "customerName": "Test Reader"
}).encode("utf-8")

req = urllib.request.Request(
    "http://localhost:3000/api/shop/checkout",
    data=checkout_data,
    headers={"Content-Type": "application/json"}
)
resp = urllib.request.urlopen(req)
checkout_res = json.loads(resp.read().decode("utf-8"))
ref = checkout_res["reference"]
order_num = checkout_res["orderNumber"]
print(f"Order Initialized: {order_num}, Ref: {ref}")

# 3. Verify payment
verify_data = json.dumps({"reference": ref}).encode("utf-8")
req2 = urllib.request.Request(
    "http://localhost:3000/api/shop/verify",
    data=verify_data,
    headers={"Content-Type": "application/json"}
)
resp2 = urllib.request.urlopen(req2)
verify_res = json.loads(resp2.read().decode("utf-8"))
print(f"Verification result: {verify_res}")

# 4. Check order-success page
req3 = urllib.request.Request(f"http://localhost:3000/shop/order-success?ref={ref}")
resp3 = urllib.request.urlopen(req3)
print(f"Order Success Page HTTP Status: {resp3.status}")

# 5. Test PDF download endpoint
req4 = urllib.request.Request(f"http://localhost:3000/api/shop/download/{order_num}")
resp4 = urllib.request.urlopen(req4)
pdf_bytes = resp4.read()
print(f"Download HTTP Status: {resp4.status}, Content-Type: {resp4.headers.get('Content-Type')}, Size: {len(pdf_bytes)} bytes")
