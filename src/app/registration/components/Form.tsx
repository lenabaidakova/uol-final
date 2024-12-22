'use client';

import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/hooks/api/useRegister';
import { Input } from '@/app/ui/Input';
import { ROLES } from '@/constants/Role';
import { SelectField } from '@/app/ui/SelectField';
import { Box, Button, Card, Flex, Heading, Link, Text } from '@radix-ui/themes';
import { ErrorApi } from '@/app/ui/ErrorApi';

const ROLE_OPTIONS = [
  {
    id: ROLES.SHELTER,
    label: 'Shelter',
  },
  {
    id: ROLES.SUPPORTER,
    label: 'Supporter',
  },
];

// schema for form validation
const registrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 5 characters'),
  role: z.enum([ROLES.SUPPORTER, ROLES.SHELTER], {
    message: 'Role is required',
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const { mutate, isMutating, error } = useRegister({
    onSuccess: () => router.push('/'),
  });

  const onSubmit = (data: RegistrationFormData) => {
    mutate(data);
  };

  return (
    <Box m="auto" maxWidth="460px" py="3" px="2" mt="4">
      <Card size="4" variant="classic">
        <Heading mb="3">Create an account</Heading>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Flex gap="3" direction="column">
            <Input
              label="Username"
              errorMessage={errors.username?.message}
              required
              {...register('username')}
            />

            <Input
              label="Password"
              type="password"
              errorMessage={errors.password?.message}
              required
              {...register('password')}
            />

            <Controller
              render={({ field: { value, onChange } }) => (
                <SelectField
                  errorMessage={errors.role?.message}
                  options={ROLE_OPTIONS}
                  value={value}
                  onChange={onChange}
                  label="Role"
                  placeholder="Pick role"
                  required
                />
              )}
              control={control}
              name="role"
            />

            {!!error && <ErrorApi error={error} />}
          </Flex>

          <Box mt="4">
            <Button
              type="submit"
              size="3"
              loading={isMutating}
              variant="soft"
              className="w-full"
            >
              Create account
            </Button>
          </Box>

          <Box mt="3" className="text-center">
            <Text size="2">
              Already have an account? <Link href="/login">Log in</Link>
            </Text>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
