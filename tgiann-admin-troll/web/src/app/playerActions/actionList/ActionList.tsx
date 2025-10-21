import trollActions from "@/const/trollActions";
import Action from "./Action";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ActionList({ searchValue }: { searchValue: string }) {
  const filteredActions =
    searchValue !== ""
      ? trollActions.filter((action) =>
          action.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      : trollActions;

  return (
    <ScrollArea className="h-[54vh]">
      <div className="w-full h-full p-[1vh] flex flex-row flex-wrap gap-[1vh]">
        {filteredActions.map((action) => (
          <Action key={action.type} {...action} />
        ))}
      </div>
    </ScrollArea>
  );
}
