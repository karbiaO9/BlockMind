import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

const GLOSSARY_TERMS = [
  {
    term: "Blockchain",
    definition:
      "A decentralized, distributed ledger that records transactions across a network of computers.",
  },
  {
    term: "DeFi",
    definition:
      "Decentralized Finance - Financial services and products built on blockchain technology.",
  },
  {
    term: "Smart Contract",
    definition:
      "Self-executing contracts with the terms directly written into code.",
  },
];

export function GlossarySection() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTerms = GLOSSARY_TERMS.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search terms..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-4">
        {filteredTerms.map((item) => (
          <Card key={item.term}>
            <CardHeader>
              <CardTitle className="text-lg font-medium">{item.term}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.definition}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 