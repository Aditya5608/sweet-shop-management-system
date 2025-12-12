def test_create_list_purchase(client):
    # Register and login
    client.post("/api/auth/register", json={"username": "bob", "password": "pass"})
    login = client.post("/api/auth/login", json={"username": "bob", "password": "pass"})
    token = login.json()["access_token"]

    headers = {"token": token}

    # Create a sweet
    s1 = {"name": "Gulab Jamun", "category": "Indian", "price": 10.5, "quantity": 5}
    resp = client.post("/api/sweets", json=s1, headers=headers)
    assert resp.status_code == 200
    sw = resp.json()
    assert sw["name"] == "Gulab Jamun"

    # List sweets
    lst = client.get("/api/sweets")
    assert lst.status_code == 200
    assert len(lst.json()) >= 1

    # Purchase
    sid = sw["id"]
    p = client.post(f"/api/sweets/{sid}/purchase?qty=2", headers=headers)
    assert p.status_code == 200
    assert p.json()["quantity"] == 3
