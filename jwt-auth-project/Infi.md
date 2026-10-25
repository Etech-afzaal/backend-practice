# A JWT consists of three parts separated by dots:

- HEADER.PAYLOAD.SIGNATURE

Example:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
.
eyJ1c2VySWQiOjEwMSwicm9sZSI6ImVtcGxveWVlIn0
.
SIGNATURE

3.1 Header

The header describes the token type and signing algorithm.
{
"alg": "HS256",
"typ": "JWT"
}
alg: Algorithm used to sign the token.
typ: Token type.

3.2 Payload
The payload contains claims about the user.
{
"userId": "101",
"role": "employee",
"iat": 1792670400,
"exp": 1792674000
}
Important: JWT payloads are Base64URL-encoded, not encrypted.
Anyone holding a JWT can decode its header and payload.
Never include passwords, OTPs, or sensitive secrets in a JWT.

3.3 Signature
The signature protects the token against unauthorized modification.
Conceptually, HS256 calculates:
HMAC-SHA256(
base64url(header) + "." + base64url(payload),
secretKey
)
Suppose the original payload contains:
{
"userId": "101",
"role": "employee"
}
Someone changes it to:
{
"userId": "101",
"role": "admin"
}
Topic 5: Access Token vs. Refresh Token
Most production applications use two types of tokens.
