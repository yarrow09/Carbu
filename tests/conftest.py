"""Fixtures communes."""

from collections.abc import Generator

import pytest


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(
    enable_custom_integrations: None,
) -> Generator[None]:
    """Autoriser le chargement des intégrations personnalisées dans les tests."""
    return
    yield
