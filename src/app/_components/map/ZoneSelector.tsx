import type { Zone } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../shadcn/ui/selected";

const ZoneSelector = ({ selected, setSelected, zones }: {
    selected: number;
    setSelected: (value: number) => void;
    zones: Zone[];
}) => {

    console.log("selected", selected);

    return (
        <>
            <Select
                onValueChange={(value) => {
                    setSelected(Number(value));
                }}
                value={selected.toString()}
            >


                <SelectTrigger>
                    <SelectValue placeholder="Selecciona un ícono" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem value={"-1"}>
                        <div className="flex flex-row gap-2">
                            No es zona
                        </div>
                    </SelectItem>
                    {zones.map((zone, key) => (
                        <SelectItem key={key} value={zone.id.toString()}>
                            <div className="flex flex-row gap-2">
                                {zone.name}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>

            </Select>
        </>
    )
}

export default ZoneSelector;