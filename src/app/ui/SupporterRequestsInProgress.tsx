import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const items = [
  {
    id: 'ip1',
    request: 'Blankets for winter',
    shelter: 'Happy Paws Shelter',
    initials: 'HP',
    date: 'Due on Dec 4',
  },
  {
    id: 'ip2',
    request: 'Emergency vet care for injured puppy',
    shelter: 'Kind Hearts Shelter',
    initials: 'KH',
    date: 'Due on Dec 3',
  },
  {
    id: 'ip3',
    request: 'Food supplies for stray cats',
    shelter: 'Paws & Claws Shelter',
    initials: 'PC',
    date: 'Due on Dec 2',
  },
  {
    id: 'ip4',
    request: 'Toys and treats for shelter dogs',
    shelter: 'Safe Haven Shelter',
    initials: 'SH',
    date: 'Due on Dec 1',
  },
];

export function SupporterRequestsInProgress() {
  return (
    <div className="space-y-8">
      {items.map((item, i) => (
        <div className="flex items-center" key={i}>
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`https://robohash.org/${item.id}.png?set=set4&size=150x150`}
              alt="Avatar"
            />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <a
              href="#"
              className="text-sm font-medium leading-none hover:underline"
            >
              {item.request}
            </a>
            <p className="text-sm text-muted-foreground">{item.shelter}</p>
          </div>
          <div className="ml-auto text-sm">{item.date}</div>
        </div>
      ))}
    </div>
  );
}
