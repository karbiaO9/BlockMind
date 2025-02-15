import { Button } from "@/components/ui/button";

interface NewsFilterProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

const CATEGORIES = [
  "Trading",
  "Technology",
  "Mining",
  "Regulation",
  "Exchange",
  "DeFi",
];

export function NewsFilter({ selectedCategories, onCategoryChange }: NewsFilterProps) {
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          variant={selectedCategories.includes(category) ? "default" : "outline"}
          size="sm"
          onClick={() => toggleCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
} 