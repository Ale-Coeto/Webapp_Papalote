// icons.ts
import { PiToilet } from "react-icons/pi";
import { FaChild, FaCloud, FaLeaf, FaPaw, FaPhoneAlt } from "react-icons/fa";
import { LuPaintbrush2, LuStore, LuSun, LuTestTubes, LuWind } from "react-icons/lu";
import { FaCartShopping, FaEarthAmericas } from "react-icons/fa6";
import { MdOfflineBolt } from "react-icons/md";
import type { IconType } from "react-icons";

export const icons = [
    {
        name: "Baño",
        icon: PiToilet,
        value: "toilet",
    },
    {
        name: "Hoja",
        icon: FaLeaf,
        value: "leaf",
    },
    {
        name: "Teléfono",
        icon: FaPhoneAlt,
        value: "phone",
    },
    {
        name: "Persona",
        icon: FaChild,
        value: "figure.child",
    },
    {
        name: "Tienda",
        icon: LuStore,
        value: "storefront",
    },
    {
        name: "Carrito",
        icon: FaCartShopping,
        value: "cart",
    },
    {
        name: "Brocha",
        icon: LuPaintbrush2,
        value: "paintbrush",
    },
    {
        name: "Experimentos",
        icon: LuTestTubes,
        value: "testtube.2",
    },
    {
        name: "Sol",
        icon: LuSun,
        value: "sun.max",
    },
    {
        name: "Nube",
        icon: FaCloud,
        value: "cloud.fill",
    },
    {
        name: "Planeta",
        icon: FaEarthAmericas,
        value: "globe.americas.fill",
    },
    {
        name: "Huella",
        icon: FaPaw,
        value: "pawprint.fill",
    },
    {
        name: "Rayo",
        icon: MdOfflineBolt,
        value: "bolt.circle.fill",
    },
    {
        name: "Viento",
        icon: LuWind,
        value: "wind",
    }
];

export const iconDictionary = icons.reduce((dict, icon) => {
    dict[icon.value] = icon;
    return dict;
}, {} as Record<string, { name: string; icon: IconType; value: string }>);