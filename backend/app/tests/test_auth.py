def test_register_and_login(client):
    # Register
    resp = client.post("/api/auth/register", json={"username": "alice", "password": "secret"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["username"] == "alice"
    assert "id" in data

    # Login
    resp2 = client.post("/api/auth/login", json={"username": "alice", "password": "secret"})
    assert resp2.status_code == 200
    token_data = resp2.json()
    assert "access_token" in token_data
