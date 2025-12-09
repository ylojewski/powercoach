import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Tag,
  Text
} from '@chakra-ui/react'
import { type ReactElement, useEffect, useMemo, useState } from 'react'

export function App(): ReactElement {
  const [health, setHealth] = useState<string>('')
  const healthKeys = useMemo(() => (health ? Object.keys(health) : []), [health])

  useEffect(() => {
    async function fetchHealth() {
      const response = await fetch('/api/v1/health')
      setHealth(await response.json())
    }
    void fetchHealth()
  }, [])

  return (
    <Container maxW="container.lg" display="flex" flexDirection="column" gap={10}>
      <Stack spacing={5}>
        <HStack spacing={3}>
          <Tag>Issue #74</Tag>
        </HStack>
        <Heading>Powercoach Manager</Heading>
        <Text>
          Chakra UI is now plugged into the Manager app with a bespoke Powercoach palette and
          typography. Explore the components below to see the theme in action.
        </Text>
        <HStack spacing={3}>
          <Button>Console</Button>
          <Button variant="outline">Demo</Button>
          <Button variant="ghost">Docs</Button>
        </HStack>
      </Stack>
      <Divider borderColor="pc.border" />

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Card>
          <CardBody as={Stack} spacing={4}>
            <HStack>
              <Heading variant="thin" size="xs">
                API
              </Heading>
            </HStack>
            <Heading size="md" color="pc.primary">
              /v1/health
            </Heading>
            <HStack wrap="wrap">
              {healthKeys.map((key) => (
                <Tag key={key}>{key}</Tag>
              ))}
            </HStack>
            <Text>The latest response from the backend endpoint keeps this card up to date.</Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody as={Stack} spacing={4}>
            <Heading variant="thin" size="xs">
              Palette
            </Heading>
            <Stack spacing={2}>
              <Box bg="pc.primary" height={2} />
              <Box bg="pc.secondary" height={2} />
              <Box bg="pc.bgAlt" height={2} />
            </Stack>
            <Text>
              primary yellows and deep ink tones drive the new interface. Surface contrast is tuned
              for dashboards and operational data.
            </Text>
          </CardBody>
        </Card>
        <Card>
          <CardBody as={Stack} spacing={4}>
            <Heading variant="thin" size="xs">
              Typography
            </Heading>
            <Heading size="lg">Anton</Heading>
            <Text color="pc.text">
              Inter keeps content readable while JetBrains Mono powers controls and labels.
            </Text>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Container>
  )
}
