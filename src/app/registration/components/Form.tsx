'use client';

import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/hooks/api/useRegister';
import { Input } from '@/app/ui/Input';
import { ROLES } from '@/constants/Role';
import { SelectField } from '@/app/ui/SelectField';
import { Box, Button, Card, Flex, Heading, Link, Text } from '@radix-ui/themes';
import { ErrorApi } from '@/app/ui/ErrorApi';
import { useState } from 'react';
import { Callout } from '@/app/ui/Callout';
import RouterLink from 'next/link';
import { appRoutes } from '@/lib/appRoutes';
import Logo from '@/app/ui/Logo';

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
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(5, 'Name must be at least 5 characters'),
  role: z.enum([ROLES.SUPPORTER, ROLES.SHELTER], {
    message: 'Role is required',
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const [isConfirmationSent, setIsConfirmationSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
  });

  const { mutate, isMutating, error } = useRegister({
    onSuccess: () => {
      setIsConfirmationSent(true);
    },
  });

  const onSubmit = (data: RegistrationFormData) => {
    mutate(data);
  };

  if (isConfirmationSent) {
    return (
      <Box m="auto" maxWidth="460px" py="3" px="2" mt="4">
        <Card size="4" variant="classic">
          <Heading mb="3">Confirm email</Heading>

          <Box>
            <Callout color="grass">
              Please check your email for a confirmation link to activate your
              account.
            </Callout>
          </Box>
        </Card>
      </Box>
    );
  }

  return (
    <Box m="auto" maxWidth="460px" py="3" px="2" mt="4">
      <Box mb="2">
        <Logo />
      </Box>
      <Card size="4" variant="classic">
        <Heading mb="3">Create an account</Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex gap="3" direction="column">
            <Input
              label="Name"
              placeholder="Enter your name"
              errorMessage={errors.name?.message}
              required
              {...register('name')}
              data-testid="name-input"
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              errorMessage={errors.email?.message}
              required
              {...register('email')}
              data-testid="email-input"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create your password"
              errorMessage={errors.password?.message}
              required
              {...register('password')}
              data-testid="password-input"
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
                  dataTestId="role-select"
                />
              )}
              control={control}
              name="role"
            />

            {!!error && <ErrorApi error={error} data-testid="error-message" />}
          </Flex>

          <Box mt="5">
            <Button
              type="submit"
              size="3"
              loading={isMutating}
              variant="soft"
              className="w-full"
              data-testid="submit-button"
            >
              Create account
            </Button>
          </Box>

          <Box mt="3" className="text-center">
            <Text size="2">
              Already have an account?{' '}
              <Link asChild>
                <RouterLink href={appRoutes.login()}>Log in</RouterLink>
              </Link>
            </Text>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
