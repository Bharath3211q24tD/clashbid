import type { Metadata } from "next";
import { CharacterDatabase } from "@/features/characters/character-database";

export const metadata: Metadata = {
  title: "Characters",
  description:
    "The CLASHBID demo character database. Thirty shared auction lots across fictional heroes, footballers, and cricketers.",
};

export default function CharactersPage() {
  return <CharacterDatabase />;
}
