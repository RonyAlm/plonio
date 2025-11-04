import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';
import { fn } from 'storybook/test';
import { CheckCheckIcon, Edit2Icon, PlusIcon, Trash2Icon } from 'lucide-react';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: { label: 'Button', size: 'small', icon: false, onClick: fn() },
  argTypes: {
    primary: {
      control: "boolean",
      description: "Define si el botón es primario o secundario",
    },
    size: {
      control: { type: "select" },
      options: ["small", "medium", "large"],
      description: "Tamaño del botón",
    },
    label: {
      control: "text",
      description: "Texto del botón (puede omitirse para solo ícono)",
    },
    icon: {
      control: { type: "select" },
      options: ["none", "trash", "add", "edit", "check",],
      mapping: {
        none: undefined,
        add: <PlusIcon size={16} />,
        edit: <Edit2Icon size={16} />,
        check: <CheckCheckIcon size={16} />,
        trash: <Trash2Icon size={16} />,
      },
      description: "Selecciona un ícono opcional",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
  },
};

export const Secondary: Story = {
};

export const Large: Story = {
  args: {
    size: 'large'
  },
};

export const Small: Story = {
  args: {
    size: 'small'
  },
};

export const WithIcon: Story = {
  args: {
    primary: true,
    label: "Agregar",
    icon: <PlusIcon size={16} />,
  },
};

export const IconOnly: Story = {
  args: {
    primary: true,
    icon: <Edit2Icon size={16} />,
    label: undefined,
  },
};
