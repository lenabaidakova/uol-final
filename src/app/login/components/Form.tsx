'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/hooks/api/useLogin';
import { useRouter } from 'next/navigation';
import { Input } from '@/app/ui/Input';
import { Box, Button, Card, Flex, Heading, Link, Text } from '@radix-ui/themes';
import { ErrorApi } from '@/app/ui/ErrorApi';
import { appRoutes } from '@/lib/appRoutes';
import RouterLink from 'next/link';
import Logo from '@/app/ui/Logo';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isMutating, error } = useLogin({
    onSuccess: () => {
      router.push('/');
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <Box m="auto" maxWidth="460px" py="3" px="2" mt="4">
      <Box mb="2">
        <Logo />
      </Box>
      <Card size="4" variant="classic">
        <Heading mb="3">Welcome back</Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex gap="3" direction="column">
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
              placeholder="Enter your password"
              type="password"
              errorMessage={errors.password?.message}
              required
              {...register('password')}
              data-testid="password-input"
            />

            {error && <ErrorApi error={error} data-testid="error-message" />}
          </Flex>

          <Box mt="5">
            <Button
              type="submit"
              size="3"
              variant="soft"
              loading={isMutating}
              className="w-full"
              data-testid="submit-button"
            >
              Log in
            </Button>
          </Box>

          <Box mt="3" className="text-center">
            <Text size="2">
              Don’t have an account yet?{' '}
              <Link asChild>
                <RouterLink href={appRoutes.registration()}>Sign up</RouterLink>
              </Link>
            </Text>
          </Box>
        </form>
      </Card>
    </Box>
  );
}
