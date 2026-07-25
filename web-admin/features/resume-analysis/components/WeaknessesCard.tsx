export function WeaknessesCard({ items }: { items: string[] }) {
  return (
    <div className="ui-card p-5">
      <h3 className="font-semibold">Geliştirilmesi gereken alanlar</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-text2">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
