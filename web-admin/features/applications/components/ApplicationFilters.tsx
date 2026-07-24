import { Input } from "@/app/components/ui/input";
import {
  applicationStatuses,
  applicationStatusMeta,
  type ApplicationFiltersState,
} from "../types";

const selectClass =
  "ui-input appearance-none cursor-pointer disabled:cursor-not-allowed";

export function ApplicationFilters({
  filters,
  cities,
  workModels,
  internshipTypes,
  onChange,
  onClear,
}: {
  filters: ApplicationFiltersState;
  cities: string[];
  workModels: string[];
  internshipTypes: string[];
  onChange: (filters: ApplicationFiltersState) => void;
  onClear: () => void;
}) {
  const update = <K extends keyof ApplicationFiltersState>(
    key: K,
    value: ApplicationFiltersState[K]
  ) => onChange({ ...filters, [key]: value });

  return (
    <div className="rounded-3xl border border-border bg-surface p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
        <Input
          type="search"
          value={filters.search}
          onChange={(event) => update("search", event.target.value)}
          placeholder="Şirket veya pozisyon ara"
          aria-label="Başvurularda ara"
          className="2xl:col-span-2"
        />
        <select
          value={filters.status}
          onChange={(event) =>
            update("status", event.target.value as ApplicationFiltersState["status"])
          }
          className={selectClass}
          aria-label="Durum filtresi"
        >
          <option value="">Tüm durumlar</option>
          {applicationStatuses.map((status) => (
            <option key={status} value={status}>{applicationStatusMeta[status].label}</option>
          ))}
        </select>
        <select
          value={filters.city}
          onChange={(event) => update("city", event.target.value)}
          className={selectClass}
          aria-label="Şehir filtresi"
        >
          <option value="">Tüm şehirler</option>
          {cities.map((city) => <option key={city}>{city}</option>)}
        </select>
        <select
          value={filters.workModel}
          onChange={(event) => update("workModel", event.target.value)}
          className={selectClass}
          aria-label="Çalışma modeli filtresi"
        >
          <option value="">Tüm çalışma modelleri</option>
          {workModels.map((model) => <option key={model}>{model}</option>)}
        </select>
        <select
          value={filters.internshipType}
          onChange={(event) => update("internshipType", event.target.value)}
          className={selectClass}
          aria-label="Staj türü filtresi"
        >
          <option value="">Tüm staj türleri</option>
          {internshipTypes.map((type) => <option key={type}>{type}</option>)}
        </select>
        <select
          value={filters.minimumScore}
          onChange={(event) => update("minimumScore", Number(event.target.value))}
          className={selectClass}
          aria-label="Minimum AI uyum skoru"
        >
          <option value={0}>Tüm AI skorları</option>
          <option value={50}>%50 ve üzeri</option>
          <option value={70}>%70 ve üzeri</option>
          <option value={85}>%85 ve üzeri</option>
        </select>
        <select
          value={filters.deadline}
          onChange={(event) =>
            update("deadline", event.target.value as ApplicationFiltersState["deadline"])
          }
          className={selectClass}
          aria-label="Son başvuru tarihi filtresi"
        >
          <option value="all">Tüm tarihler</option>
          <option value="seven-days">7 gün içinde</option>
          <option value="expired">Süresi dolanlar</option>
        </select>
      </div>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={filters.sort}
          onChange={(event) =>
            update("sort", event.target.value as ApplicationFiltersState["sort"])
          }
          className={`${selectClass} sm:max-w-52`}
          aria-label="Başvuruları sırala"
        >
          <option value="deadline">Son Başvuru Tarihi Yakın</option>
          <option value="newest">En Yeni</option>
          <option value="oldest">En Eski</option>
          <option value="ai-score">En Yüksek AI Skoru</option>
          <option value="last-updated">Son Güncellenen</option>
        </select>
        <button type="button" onClick={onClear} className="text-sm font-semibold text-brand">
          Filtreleri temizle
        </button>
      </div>
    </div>
  );
}
