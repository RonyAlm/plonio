import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Input from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  args: { label: 'Input', placeholder: 'Placeholder', value: '', type: 'text', message: '', onChange: fn() },

} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {

}

export const WithMessage: Story = {
    args: { message: 'Email no válido' }
}
  