import { countText } from "../utils/assistant-utils";

export function CharacterCounter({ content }: { content: string }) {
  const count = countText(content);
  return (
    <p className="text-xs text-text2">
      {count.characters} karakter · {count.words} kelime
    </p>
  );
}
