import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
  Field,
  FieldLabel,
  Form,
  Input,
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue
} from '@powercoach/ui'
import { CircleAlertIcon } from 'lucide-react'

const frameworkOptions = [
  { label: 'Next.js', value: 'next' },
  { label: 'Vite', value: 'vite' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' }
]

export default function CardDemo() {
  return (
    <Card className="w-full max-w-xs m-3">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardPanel>
        <Form>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input placeholder="Name of your project" type="text" />
          </Field>
          <Field>
            <FieldLabel>Framework</FieldLabel>
            <Select defaultValue="next" items={frameworkOptions}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectPopup>
                {frameworkOptions.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectPopup>
            </Select>
          </Field>
          <Button className="w-full" type="submit">
            Deploy
          </Button>
        </Form>
      </CardPanel>
      <CardFooter>
        <div className="flex gap-1 text-muted-foreground text-xs">
          <CircleAlertIcon className="size-3 h-lh shrink-0" />
          <p>This will take a few seconds to complete.</p>
        </div>
      </CardFooter>
    </Card>
  )
}
