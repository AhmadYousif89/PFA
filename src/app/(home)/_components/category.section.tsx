import { useState } from "react";

import { cn } from "@/lib/utils";
import { CategorySlug } from "@/lib/types";
import { UserCategory } from "@/app/(auth)/_lib/types";
import { getCategoryLabel, themeColors, type ThemeValue } from "@/lib/config";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

import Entertainment from "public/assets/images/icon-entertainment.svg";
import Bill from "public/assets/images/icon-bill.svg";
import Groceries from "public/assets/images/icon-groceries.svg";
import Dining from "public/assets/images/icon-dining.svg";
import Car from "public/assets/images/icon-car.svg";
import Heart from "public/assets/images/icon-personal-care.svg";
import GraduationCap from "public/assets/images/icon-education.svg";
import Sparkles from "public/assets/images/icon-lifestyle.svg";
import Shopping from "public/assets/images/icon-shopping.svg";
import Plus from "public/assets/images/icon-plus.svg";

type Props = {
  stashData: UserCategory[];
  isVisible: boolean;
  onBack: () => void;
  onComplete: (categories: UserCategory[]) => void;
  onScrollToNext: () => void;
};

type Category = UserCategory & { icon: React.ComponentType<React.SVGProps<SVGSVGElement>> };

const categoryMap: Category[] = [
  { slug: "entertainment", label: "Entertainment", icon: Entertainment, theme: "" },
  { slug: "bills", label: "Bills", icon: Bill, theme: "" },
  { slug: "groceries", label: "Groceries", icon: Groceries, theme: "" },
  { slug: "dining-out", label: "Dining Out", icon: Dining, theme: "" },
  { slug: "transportation", label: "Transportation", icon: Car, theme: "" },
  { slug: "personal-care", label: "Personal Care", icon: Heart, theme: "" },
  { slug: "education", label: "Education", icon: GraduationCap, theme: "" },
  { slug: "lifestyle", label: "Lifestyle", icon: Sparkles, theme: "" },
  { slug: "shopping", label: "Shopping", icon: Shopping, theme: "" },
  { slug: "general", label: "General", icon: Plus, theme: "" },
];

export const CategorySelectionSection = ({
  isVisible,
  onBack,
  onComplete,
  onScrollToNext,
  stashData,
}: Props) => {
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState<CategorySlug | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<UserCategory[]>(stashData ?? []);

  const allSelected = selectedCategories.length === categoryMap.length;

  // Handle category click - select/deselect or open color picker
  const handleCategoryClick = (categoryId: CategorySlug) => {
    const existingIndex = selectedCategories.findIndex((c) => c.slug === categoryId);
    if (existingIndex !== -1) {
      // Remove category if already selected
      setSelectedCategories((prev) => prev.filter((c) => c.slug !== categoryId));
    } else {
      // Open color picker modal for new category
      setPendingCategory(categoryId);
      setIsColorModalOpen(true);
    }
  };

  const getAvailableThemes = () => {
    const usedThemes = selectedCategories.map((c) => c.theme);
    return Object.values(themeColors).filter((t) => !usedThemes.includes(t));
  };

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedCategories([]);
    } else {
      // Select all with random colors
      const unselectedCategories = categoryMap.filter(
        (cat) => !selectedCategories.some((selected) => selected.slug === cat.slug),
      );
      const availableThemes = getAvailableThemes();
      let colorsPool = [...availableThemes];

      const newCategories = unselectedCategories.map((cat) => {
        if (colorsPool.length === 0) {
          colorsPool = [...Object.values(themeColors)]; // Reset pool if exhausted
        }
        const randomColor = getRandomColor(colorsPool);
        colorsPool = colorsPool.filter((c) => c !== randomColor); // Remove used color from pool
        return { slug: cat.slug, label: cat.label, theme: randomColor };
      });

      setSelectedCategories((prev) => [...prev, ...newCategories]);
    }
  };

  const getCategoryTheme = (slug: string) => {
    return selectedCategories.find((c) => c.slug === slug)?.theme;
  };

  const getRandomColor = (availableColors: ThemeValue[]) => {
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
  };

  const isCategorySelected = (slug: string) => {
    return selectedCategories.some((c) => c.slug === slug);
  };

  const handleModalClose = (open: boolean) => {
    if (!open) {
      // Modal closed without selecting color - reset pending category
      setPendingCategory(null);
    }
    setIsColorModalOpen(open);
  };

  const handleColorSelect = (theme: string) => {
    if (pendingCategory) {
      const newCategory: UserCategory = {
        slug: pendingCategory,
        label: getCategoryLabel(pendingCategory),
        theme,
      };
      setSelectedCategories((prev) => [...prev, newCategory]);
      setIsColorModalOpen(false);
      setPendingCategory(null);
    }
  };

  const handleContinue = () => {
    if (selectedCategories.length) {
      onComplete(selectedCategories);
      onScrollToNext();
    }
  };

  const usedTheme = selectedCategories.map((c) => c.theme);

  return (
    <Section
      id="category-selection"
      data-section="categories"
      title="Choose Your Categories"
      description="Select the budget categories that fit your lifestyle. This will shape out your base budgets but you can always customize them later."
      onSkip={onScrollToNext}
      onBack={onBack}
      className={cn(
        isVisible
          ? "visible translate-y-0 opacity-100 delay-500"
          : "pointer-events-none invisible -translate-y-24 opacity-0 delay-0",
      )}
    >
      <div className="space-y-10">
        <div className="flex items-center justify-start gap-8">
          <Button
            variant="outline"
            onClick={handleToggleSelectAll}
            className="h-10 w-28 rounded px-1"
          >
            {allSelected ? "Clear All" : "Select All"}
          </Button>
          {selectedCategories.length ? (
            <span className="bg-primary text-primary-foreground flex aspect-square size-10 items-center justify-center rounded-sm text-lg font-bold shadow-md">
              {selectedCategories.length}
            </span>
          ) : null}
        </div>
        {/* Category Grid */}
        <div
          className="custom-grid"
          style={
            { "--grid-max-col-count": 5, "--grid-min-col-size": "6rem" } as React.CSSProperties
          }
        >
          {categoryMap.map((category) => {
            const Icon = category.icon;
            const isSelected = isCategorySelected(category.slug);
            const categoryTheme = getCategoryTheme(category.slug);

            return (
              <Button
                key={category.slug}
                variant="secondary"
                size="auto"
                onClick={() => handleCategoryClick(category.slug)}
                className={cn(
                  "group hover:border-primary/50 relative flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 shadow transition-all",
                  isSelected
                    ? "border-primary bg-card shadow-primary/10 shadow-lg"
                    : "border-border bg-card/75 hover:shadow-lg",
                )}
              >
                <div
                  className={`flex size-8 items-center justify-center rounded shadow-xs transition-colors lg:size-12 ${
                    isSelected ? "text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                  style={isSelected ? { backgroundColor: categoryTheme } : undefined}
                >
                  <Icon
                    className={cn(
                      isSelected ? "fill-card" : "fill-muted-foreground",
                      "size-6 lg:size-8",
                    )}
                  />
                </div>
                <span
                  className={`text-center text-xs font-medium md:text-sm ${
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {category.label}
                </span>
                {isSelected && (
                  <div className="bg-primary absolute top-1 right-1 flex size-5 items-center justify-center rounded-full shadow-md md:size-6">
                    <CheckMark />
                  </div>
                )}
              </Button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pb-8">
          <Button variant="outline" size="lg" onClick={onBack} className="bg-transparent px-8">
            Cancel
          </Button>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={selectedCategories.length === 0}
            className="shadow-lg"
          >
            Continue
          </Button>
        </div>
      </div>

      <Dialog open={isColorModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-card">
          <DialogHeader className="flex-row items-center text-start">
            <Palette />
            <DialogTitle className="text-base sm:text-lg">
              Choose a Color for{" "}
              <span>
                ‘{pendingCategory && categoryMap.find((c) => c.slug === pendingCategory)?.label}’
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-3 py-4">
            {Object.entries(themeColors).map(([name, colorVar]) => {
              const isUsed = usedTheme.includes(colorVar);

              return (
                <button
                  key={name}
                  onClick={() => !isUsed && handleColorSelect(colorVar)}
                  disabled={isUsed}
                  className={`group relative flex flex-col items-center gap-2 transition-transform ${
                    isUsed ? "cursor-not-allowed opacity-40" : "cursor-pointer"
                  }`}
                  title={isUsed ? `${name} (Already used)` : name}
                >
                  <div
                    className={cn(
                      "size-12 rounded-lg",
                      isUsed
                        ? ""
                        : "group-hover:ring-border ring-offset-2 transition-all group-hover:shadow-lg group-hover:ring-2",
                    )}
                    style={{ backgroundColor: colorVar }}
                  />
                  <span className="text-muted-foreground group-hover:text-foreground text-xs">
                    {name}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </Section>
  );
};

const CheckMark = () => {
  return (
    <svg
      className="text-primary-foreground size-3 md:size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
};

const Palette = () => {
  return (
    <svg
      className="fill-muted-foreground size-6"
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
    >
      <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z" />
    </svg>
  );
};
