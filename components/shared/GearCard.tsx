import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gear } from "@/lib/types";
// import type { Gear } from "@/types/gear";

type GearCardProps = {
  gear: Gear;
};

const GearCard = ({ gear }: GearCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <h2 className="text-xl font-semibold">{gear.name}</h2>

        {gear.category && (
          <p className="text-sm text-muted-foreground">
            {typeof gear.category === "string"
              ? gear.category
              : gear.category.name}
          </p>
        )}
      </CardHeader>

      <CardContent>
        {gear.description && (
          <p className="text-sm text-muted-foreground">
            {gear.description}
          </p>
        )}

        <p className="mt-4 text-lg font-bold">
          ${Number(gear.pricePerDay).toFixed(2)} / day
        </p>
      </CardContent>

      <CardFooter>
       <Link
  href={`/api/gear/getgearbyid?id=${gear.id}`}
  className="w-full"
>
  <Button className="w-full">
    View Details
  </Button>
</Link>
      </CardFooter>
    </Card>
  );
};

export default GearCard;