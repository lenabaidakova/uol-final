import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

const items = [
    {
        id: 'rte1',
        request: 'Food donations for winter',
        shelter: 'Happy Paws Shelter',
        initials: 'HP',
        date: 'Dec 5',
    },
    {
        id: 'rte2',
        request: 'Vet assistance for injured cat',
        shelter: 'Kind Hearts Shelter',
        initials: 'KH',
        date: 'Dec 4',
    },
    {
        id: 'rte3',
        request: 'Blankets for shelter dogs',
        shelter: 'Safe Haven Shelter',
        initials: 'SH',
        date: 'Dec 3',
    },
    {
        id: 'rte4',
        request: 'Heating support for shelter',
        shelter: 'Warm Hearts Shelter',
        initials: 'WH',
        date: 'Dec 2',
    },
    {
        id: 'rte5',
        request: 'Cat litter supplies',
        shelter: 'Paws & Claws Shelter',
        initials: 'PC',
        date: 'Dec 1',
    },
];

export function SupporterRequestsInProgress() {
    return (
        <div className="space-y-8">
            {
                items.map((item, i) => (
                    <div className="flex items-center" key={i}>
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://robohash.org/${item.id}.png?set=set4&size=150x150`} alt="Avatar"/>
                            <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <a href="#" className="text-sm font-medium leading-none hover:underline">
                                {item.request}
                            </a>
                            <p className="text-sm text-muted-foreground">
                                {item.shelter}
                            </p>
                        </div>
                        <div className="ml-auto text-sm">{item.date}</div>
                    </div>
                ))
            }
        </div>
    )
}
