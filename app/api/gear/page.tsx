import GearCard from "@/components/shared/GearCard";
import { getAllGear } from "@/lib/gearApi";
import { Gear } from "@/lib/types";
// import type { Gear } from "@/types/gear";

const GearPage = async () => {
  const result = await getAllGear();

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="rounded-lg border p-6 text-center">
          <h2 className="text-xl font-semibold">
            Failed to load gear
          </h2>

          <p className="mt-2 text-muted-foreground">
            {result.message}
          </p>
        </div>
      </div>
    );
  }

  const gears: Gear[] = result.data?.data ?? result.data ?? [];

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Sports & Outdoor Gear
        </h1>

        <p className="mt-2 text-muted-foreground">
          Find the perfect gear for your next adventure.
        </p>
      </div>

      {gears.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-muted-foreground">
            No gear available right now.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {gears.map((gear) => (
            <GearCard key={gear.id} gear={gear} />
          ))}
        </div>
      )}
    </main>
  );
};

export default GearPage;