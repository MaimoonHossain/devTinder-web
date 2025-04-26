// components/UserCard.tsx
'use client';

import { X, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  photoUrl: string;
  about: string;
  skills: string[];
}

interface Props {
  user: User;
  onIgnore?: () => void;
  onInterested?: () => void;
}

const UserCard = ({ user, onIgnore, onInterested }: Props) => {
  return (
    <Card className='w-full max-w-sm hover:shadow-lg transition-shadow'>
      <CardContent className='pt-6'>
        <div className='flex items-center gap-4'>
          <Avatar className='h-16 w-16'>
            <AvatarImage
              src={user.photoUrl}
              alt={`${user.firstName} ${user.lastName}`}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.src = '';
              }}
            />
            <AvatarFallback>
              <User className='h-6 w-6' />
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className='text-xl font-semibold'>
              {user.firstName} {user.lastName}
            </h2>
            <p className='text-sm text-muted-foreground'>
              {user.age} years • {user.gender}
            </p>
          </div>
        </div>

        <p className='mt-4 text-sm text-foreground'>{user.about}</p>

        {user.skills?.length > 0 && (
          <div className='mt-4 flex flex-wrap gap-2'>
            {user.skills.map((skill, index) => (
              <Badge key={index} variant='secondary'>
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className='flex justify-between gap-3'>
        <Button variant='outline' className='flex-1 gap-2' onClick={onIgnore}>
          <X className='h-4 w-4' />
          Ignore
        </Button>
        <Button
          variant='default'
          className='flex-1 gap-2 bg-rose-500 hover:bg-rose-600'
          onClick={onInterested}
        >
          <Heart className='h-4 w-4 fill-current' />
          Interested
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserCard;
