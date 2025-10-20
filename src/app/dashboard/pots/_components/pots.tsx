import { PotCard } from "./pot.card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPots, getPotsThemes } from "@/app/shared-data/pots";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { PotCreationModal } from "./create.modal";

import PotIcon from "public/assets/images/icon-nav-pots.svg";

export const Pots = async () => {
  const data = await getPots();
  const selectedThemes = await getPotsThemes();

  if (data.length === 0) {
    return (
      <Empty className="bg-card/90 place-self-center p-10 shadow-lg">
        <EmptyHeader>
          <PotIcon className="mb-6 size-fit scale-200" />
          <EmptyTitle className="lg:text-lg">You pots are looking a bit empty</EmptyTitle>
          <EmptyDescription className="lg:text-base">
            Start organizing your finances by creating your first pot.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <PotCreationModal selectedThemes={selectedThemes} />
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ScrollArea className="xl:h-(--scroll-max-h)">
      <article className="custom-grid">
        {data.map((pot) => (
          <PotCard key={pot.id} pot={pot} selectedThemes={selectedThemes} />
        ))}
      </article>
    </ScrollArea>
  );
};
