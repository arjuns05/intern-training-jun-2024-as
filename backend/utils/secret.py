iap_client_id = (
    "590571108011-o37jof2iadluek3dpuit5n9h8u5jldla.apps.googleusercontent.com"
)
vault_role = "175298940333-compute_developer.gserviceaccount.com"


def get_secret(path):
    """Helper function to fetch a secret from Vault at the path provided.

    Notably, this function can work in local development environments as well
    as GCP environments. Local development environments are supported by first
    attempting to load a ".vault-token" file from the user's home directory.
    This file is created when authenticating via the Vault CLI. If this file is
    not found, it will attempt GCP-based authentication.

    Finally, this example **does not** include an acceptable level of
    error-handling, and should only be used as inspiration.
    """
    # Used to find/load Vault CLI token
    from pathlib import Path

    # Used to submit requests to Vault
    import requests

    # Official Google libraries to authenticate to IAP + Vault
    from google.auth.transport.requests import Request
    from google.oauth2 import id_token

    try:
        # First, we attempt to load a local short-lived ".vault-token" to use
        # as our "X-Vault-Token" header for later requests.
        headers = {
            "X-Vault-Token": (Path.home() / ".vault-token").read_text(),
        }
        # If that succeeds, we should be able to connect to the "internal"
        # Vault address directly
        vault_address = "https://vault.colpal.cloud"
    # If the ".vault-token" file is not found, we will instead attempt a
    # GCP-based authentication
    except FileNotFoundError:
        # In this case, while the "internal" Vault address may be accessible,
        # it is better to assume it isn't, and use the "public" Vault address
        vault_address = "https://public.vault.colpal.cloud"
        # We ask GCP to sign a JWT to allow bypassing the Identity-Aware Proxy
        # (IAP) in front of Vault
        iap_jwt = id_token.fetch_id_token(Request(), iap_client_id)
        # We ask GCP to sign a JWT to allow authenticating to Vault with our
        # pre-configured Vault role
        vault_jwt = id_token.fetch_id_token(Request(), f"vault/{vault_role}")
        # The JWT that allows bypassing the IAP must be included in the
        # "Authorization" header with a "Bearer" scheme
        headers = {"Authorization": f"Bearer {iap_jwt}"}
        # We issue a request to Vault at the GCP-based authentication endpoint.
        # This must include our Vault role, a JWT signed by GCP for our Vault
        # role, and due to the IAP in front of Vault, a JWT signed by GCP for
        # the IAP itself. If all goes well, the response will include our
        # short-lived Vault token.
        login_response = requests.post(
            f"{vault_address}/v1/auth/gcp/login",
            headers=headers,
            json={"role": vault_role, "jwt": vault_jwt},
        )
        # We update our headers to include the short-lived Vault token as the
        # "X-Vault-Token" header. Our headers still include the IAP-bound
        # "Authorization" header.
        headers.update(
            [
                ("X-Vault-Token", login_response.json()["auth"]["client_token"]),
            ]
        )
    # Regardless of the method used to arrive to the proper Vault address and
    # token, requesting a secret involves submitting a simple GET request to
    # Vault
    secret_response = requests.get(
        f"{vault_address}/v1/{path}",
        headers=headers,
    )
    # A response from Vault includes additional metadata. If you only want the
    # secret value, you must subscript into a deeply-nested dictionary.
    return secret_response.json()["data"]["data"]
