import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { getGearById } from "@/lib/gearApi";

type GearDetailsPageProps = {
  searchParams: Promise<{
    id?: string;
  }>;
};

const GearDetailsPage = async ({
  searchParams,
}: GearDetailsPageProps) => {
  const { id } = await searchParams;

  if (!id) {
    return (
      <main className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold">
              Gear ID is missing
            </h1>

            <p className="mt-2 text-muted-foreground">
              Please select a gear item from the gear list.
            </p>

            <Link href="/api/gear">
              <Button className="mt-6">
                Back to Gear
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const result = await getGearById(id);

  if (!result.success) {
    return (
      <main className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold">
              Failed to load gear
            </h1>

            <p className="mt-2 text-muted-foreground">
              {result.message}
            </p>

            <Link href="/api/gear">
              <Button className="mt-6">
                Back to Gear
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  const gear = result.data?.data ?? result.data;

  if (!gear) {
    return (
      <main className="container mx-auto px-4 py-10">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold">
              Gear not found
            </h1>

            <Link href="/api/gear">
              <Button className="mt-6">
                Back to Gear
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href="/api/gear"
          className="text-sm text-muted-foreground hover:underline"
        >
          ← Back to Gear
        </Link>
      </div>

      <Card className="mx-auto max-w-4xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="flex min-h-80 items-center justify-center bg-muted">
            {gear.image ? (
              <img
                src={gear.image}
                alt={gear.name}
                className="h-full max-h-96 w-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground">
                No image available
              </span>
            )}
          </div>

          <div>
            <CardHeader>
              <h1 className="text-3xl font-bold">
                {gear.name}
              </h1>

              {gear.brand && (
                <p className="text-muted-foreground">
                  Brand: {gear.brand}
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Description
                </p>

                <p className="mt-1">
                  {gear.description || "No description available."}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Category
                </p>

                <p className="mt-1 font-medium">
                  {gear.category?.name || "Uncategorized"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Price
                </p>

                <p className="text-2xl font-bold">
                  ${Number(gear.pricePerDay).toFixed(2)} / day
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Stock
                </p>

                <p className="mt-1 font-medium">
                  {gear.stock ?? 0} available
                </p>
              </div>

              <Button className="w-full" size="lg">
                Rent This Gear
              </Button>
            </CardContent>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default GearDetailsPage;