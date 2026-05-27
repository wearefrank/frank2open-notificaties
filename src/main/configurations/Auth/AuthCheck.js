"use strict";

function decodeAndValidate(jwt, timeout) {
    if (!jwt || jwt === "null") return JSON.stringify({ status: "401" });
    if (!jwt.startsWith("Bearer ")) return JSON.stringify({ status: "401" });

    jwt = jwt.replace("Bearer ", "");
    let parts = jwt.split(".");
    if (parts.length !== 3) return JSON.stringify({ status: "401" });

    // let header = parts[0]
    let payload = parts[1]
    // let sig = parts[2];

    let decoded;
    try {
        decoded = String(new java.lang.String(
            java.util.Base64.getDecoder().decode(payload)
        ));
    } catch (e) {
        return JSON.stringify({ status: "401" });
    }

    let claims = {};
    claims.iss = undefined;
    claims.iat = undefined;
    claims.client_id = undefined;
    claims.user_id = undefined;
    claims.user_representation = undefined;

    try {
        claims = JSON.parse(decoded);
        if (!claims.iss || !claims.iat || !claims.client_id ) return JSON.stringify({ status: "401" });
        if (claims.iss !== claims.client_id) return JSON.stringify({ status: "401" });
    } catch (e) {
        return JSON.stringify({ status: "401" });
    }

    let timestamp = Math.floor(Date.now() / 1000);
    let timeBetween = timestamp - claims.iat;

    // if (timeBetween < 0) return JSON.stringify({ status: "401" });
    if (timeBetween > parseInt(timeout)) return JSON.stringify({ status: "401" });

    return JSON.stringify({ status: "200", clientId: claims.client_id });
}

function verifyHmac(jwt, secret) {
    if (!jwt || jwt === "null") return "401";
    if (!secret) return "401";

    jwt = jwt.replace("Bearer ", "");
    let parts = jwt.split(".");
    if (parts.length !== 3) return "401";

    let header = parts[0]
    let payload = parts[1]
    let sig = parts[2];

    let computed = _generateHmac(header + "." + payload, secret);

    return computed === sig ? "200" : "401";
}

function checkScopes(acResponseJson, requiredScopesJson) {
    let acResponse = JSON.parse(acResponseJson);
    let requiredScopes = JSON.parse(requiredScopesJson);

    let grantedScopes = acResponse.autorisaties.flatMap(function(a) {
        return a.scopes;
    });

    let hasScope = false;

    grantedScopes.forEach((grantedScope) => {
        if (requiredScopes.includes(grantedScope)) {
            hasScope = true;
        }
    })

    return hasScope ? "200" : "403";
}

function _toBytes(str) {
    var buf = java.nio.charset.StandardCharsets.UTF_8.encode(str);
    return java.util.Arrays.copyOf(buf.array(), buf.limit());
}

function _generateHmac(input, secret) {
    var mac = javax.crypto.Mac.getInstance("HmacSHA256");
    var secretKeySpec = new javax.crypto.spec.SecretKeySpec(_toBytes(secret), "HmacSHA256");
    mac.init(secretKeySpec);
    var rawHmac = mac.doFinal(_toBytes(input));
    return java.util.Base64.getUrlEncoder()
        .withoutPadding()
        .encodeToString(rawHmac);
}