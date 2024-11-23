// icons.ts
import { PiToilet } from "react-icons/pi";
import { FaLeaf, FaPhoneAlt } from "react-icons/fa";
import { LuStore } from "react-icons/lu";
import { FaPerson } from "react-icons/fa6";
import { IconType } from "react-icons";

export const icons = [
    {
        name: "Baño",
        icon: PiToilet,
        value: "toilet",
    },
    {
        name: "Hoja",
        icon: FaLeaf,
        value: "hoja",
    },
    {
        name: "Teléfono",
        icon: FaPhoneAlt,
        value: "telefono",
    },
    {
        name: "Persona",
        icon: FaPerson,
        value: "a",
    },
    {
        name: "Tienda",
        icon: LuStore,
        value: "x",
    },
];

export const iconDictionary = icons.reduce((dict, icon) => {
    dict[icon.value] = icon;
    return dict;
}, {} as Record<string, { name: string; icon: IconType; value: string }>);