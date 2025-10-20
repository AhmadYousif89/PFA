import type { Metadata } from "next";

import { Pots } from "./_components/pots";
import { getPotsCount, getPotsThemes } from "../../shared-data/pots";
import { PotCreationModal } from "./_components/create.modal";

export const metadata: Metadata = {
  title: "Pots - Personal Finance App",
  description:
    "Create and manage your financial pots to organize your savings and expenses effectively.",
};

export default async function PotsPage() {
  const count = await getPotsCount();
  const selectedThemes = await getPotsThemes();

  return (
    <div className="flex grow flex-col gap-8">
      <header className="border-border/20 flex items-start justify-between gap-2 border-b pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Pots</h1>
          <p className="text-muted-foreground text-xs font-medium md:text-sm">
            Manage your pots to organize your savings and expenses effectively.
          </p>
        </div>
        {count < 1 ? null : <PotCreationModal selectedThemes={selectedThemes} />}
      </header>

      <section className="@container/pots grid grow">
        <Pots />
      </section>
    </div>
  );
}
