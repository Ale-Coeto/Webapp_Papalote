import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shadcn/ui/selected";

import { icons, iconDictionary } from "../../../utils/icons";

const IconSelector = ({ selected, setSelected }: {
    selected: string;
    setSelected: (value: string) => void;
}) => {

    return (
        <>
            <Select
                onValueChange={(value) => {
                    setSelected(value);
                }}
                value={selected}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Selecciona un ícono" />
                </SelectTrigger>

                <SelectContent>
                    {icons.map((icon ) => (
                        <SelectItem key={icon.name} value={icon.value}>
                            <div className="flex flex-row gap-2">
                                <icon.icon className="w-6 h-6" />
                                {icon.name}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </>
    )
}

export default IconSelector;