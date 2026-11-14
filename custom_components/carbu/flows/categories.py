"""Page globale : catégories de dépense (création, modification, suppression)."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlowResult
from homeassistant.helpers.selector import (
    ColorRGBSelector,
    IconSelector,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
)
import probatio as vol

from ..core.models import CATEGORY_OTHER, Category
from ..core.repository import CategoryError
from ..labels import async_category_labels
from .common import CONF_CATEGORY, OptionsFlowBase


def _hex_to_rgb(value: str | None) -> list[int] | None:
    if not value or len(value) != 7:
        return None
    return [int(value[i : i + 2], 16) for i in (1, 3, 5)]


def _rgb_to_hex(value: list[int] | None) -> str | None:
    if not value:
        return None
    return "#{:02x}{:02x}{:02x}".format(*value)


class CategoriesFlow(OptionsFlowBase):
    """Étapes ``add_category``, ``edit_category`` et ``delete_category``."""

    _category_id: str | None = None

    async def _labels(self) -> dict[str, str]:
        """Libellé affiché de chaque catégorie (nom saisi ou traduction)."""
        labels = await async_category_labels(self.hass)
        return {
            cat.id: cat.name or labels.get(cat.id, cat.id)
            for cat in self._entry.runtime_data.storage.data.categories.values()
        }

    async def _category_selector(self, exclude: set[str]) -> SelectSelector:
        labels = await self._labels()
        options = [
            SelectOptionDict(value=cid, label=label)
            for cid, label in sorted(labels.items(), key=lambda kv: kv[1].casefold())
            if cid not in exclude
        ]
        return SelectSelector(
            SelectSelectorConfig(options=options, mode=SelectSelectorMode.DROPDOWN)
        )

    async def async_step_add_category(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Créer une catégorie personnalisée."""
        errors: dict[str, str] = {}
        if user_input is not None:
            name = user_input["name"].strip()
            if name.casefold() in {
                n.casefold() for n in (await self._labels()).values()
            }:
                errors["name"] = "category_exists"
            else:
                try:
                    self._entry.runtime_data.storage.data.add_category(
                        Category(
                            name=name,
                            color=_rgb_to_hex(user_input.get("color")),
                            icon=user_input.get("icon"),
                        )
                    )
                except CategoryError:
                    errors["name"] = "name_required"
                else:
                    return self._done()
        schema = vol.Schema(
            {
                vol.Required("name"): TextSelector(),
                vol.Optional("color"): ColorRGBSelector(),
                vol.Optional("icon"): IconSelector(),
            }
        )
        return self.async_show_form(
            step_id="add_category",
            data_schema=self.add_suggested_values_to_schema(schema, user_input or {}),
            errors=errors,
        )

    async def async_step_edit_category(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Choisir la catégorie à modifier."""
        if user_input is not None:
            self._category_id = user_input[CONF_CATEGORY]
            return await self.async_step_edit_category_details()
        return self.async_show_form(
            step_id="edit_category",
            data_schema=vol.Schema(
                {vol.Required(CONF_CATEGORY): await self._category_selector(set())}
            ),
        )

    async def async_step_edit_category_details(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Renommer, changer la couleur ou l'icône."""
        assert self._category_id is not None
        data = self._entry.runtime_data.storage.data
        category = data.categories[self._category_id]
        errors: dict[str, str] = {}
        if user_input is not None:
            name = (user_input.get("name") or "").strip()
            others = {
                label.casefold()
                for cid, label in (await self._labels()).items()
                if cid != category.id
            }
            if name.casefold() in others:
                errors["name"] = "category_exists"
            else:
                try:
                    data.update_category(
                        category.id,
                        name=name,
                        color=_rgb_to_hex(user_input.get("color")),
                        icon=user_input.get("icon"),
                    )
                except CategoryError:
                    errors["name"] = "name_required"
                else:
                    return self._done()

        label = (await self._labels())[category.id]
        schema = vol.Schema(
            {
                vol.Optional("name"): TextSelector(),
                vol.Optional("color"): ColorRGBSelector(),
                vol.Optional("icon"): IconSelector(),
            }
        )
        suggested: dict[str, Any] = {"name": category.name or ""}
        if (rgb := _hex_to_rgb(category.color)) is not None:
            suggested["color"] = rgb
        if category.icon:
            suggested["icon"] = category.icon
        return self.async_show_form(
            step_id="edit_category_details",
            data_schema=self.add_suggested_values_to_schema(
                schema, user_input or suggested
            ),
            errors=errors,
            description_placeholders={"category": label},
        )

    async def async_step_delete_category(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Choisir la catégorie à supprimer (« autre » est exclue)."""
        if user_input is not None:
            self._category_id = user_input[CONF_CATEGORY]
            return await self.async_step_confirm_delete()
        return self.async_show_form(
            step_id="delete_category",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_CATEGORY): await self._category_selector(
                        {CATEGORY_OTHER}
                    )
                }
            ),
        )

    async def async_step_confirm_delete(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Confirmer la suppression et la réassignation des dépenses."""
        assert self._category_id is not None
        data = self._entry.runtime_data.storage.data
        if user_input is not None:
            data.delete_category(self._category_id)
            return self._done()
        labels = await self._labels()
        return self.async_show_form(
            step_id="confirm_delete",
            data_schema=vol.Schema({}),
            description_placeholders={
                "category": labels[self._category_id],
                "count": str(data.category_usage(self._category_id)),
                "other": labels[CATEGORY_OTHER],
            },
        )
