import {
    Breadcrumb,
    Box,
    Button,
    MenuItem,
    Portal,
    Menu,
    IconButton,
    ButtonGroup,
} from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";
import { Fragment } from "react/jsx-runtime";
import { ElementType, FC, ReactNode } from "react";
import { LiaSlashSolid } from "react-icons/lia";

export interface MenuItem {
    label: string;
    value: string;
}

export interface BreadcrumbItem {
    label: string;
    options?: MenuItem[];
    icon?: (size: number) => ReactNode;
    onClick?: () => void;
    onSelect?: (value: string) => void;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const SplitButton: FC<{
    as?: ElementType;
    active?: boolean;
    label: string;
    icon?: ReactNode;
    items?: Array<MenuItem>;
    onClick?: () => void;
    onSelect?: (value: string) => void;
}> = ({ as, active, label, icon, items, onClick, onSelect }) => {
    return (
        <Menu.Root positioning={{ placement: "bottom-end" }}>
            <ButtonGroup attached size={"sm"}>
                <Button
                    as={as}
                    variant="ghost"
                    color={active ? "white" : "gray.400"}
                    rounded={"full"}
                    onClick={onClick}
                    _hover={{ bg: "whiteAlpha.200", color: "white" }}
                >
                    {icon}
                    {label}
                </Button>
                {items && items.length > 0 && onSelect && (
                    <Menu.Trigger asChild>
                        <IconButton
                            variant="ghost"
                            rounded={"full"}
                            _hover={{ bg: "whiteAlpha.200", color: "white" }}
                        >
                            <LuChevronDown />
                        </IconButton>
                    </Menu.Trigger>
                )}
            </ButtonGroup>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        {items?.map((item) => (
                            <Menu.Item
                                key={item.value}
                                value={item.value}
                                onClick={() => onSelect?.(item.value)}
                            >
                                {item.label}
                            </Menu.Item>
                        ))}
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    if (!items || items.length === 0) return null;

    return (
        <Box
            position="fixed"
            top="4"
            left="4"
            bg="rgba(20, 20, 20, 0.8)"
            backdropFilter="blur(12px)"
            borderRadius="full"
            p="1"
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.4)"
            zIndex={1000}
        >
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    {items.map((item, index) => (
                        <Fragment key={index}>
                            <Breadcrumb.Item>
                                <SplitButton
                                    as={
                                        index === items.length - 1
                                            ? Breadcrumb.CurrentLink
                                            : Breadcrumb.Link
                                    }
                                    active={index === items.length - 1}
                                    label={item.label}
                                    icon={item.icon?.(16)}
                                    items={item.options}
                                    onClick={item.onClick}
                                    onSelect={item.onSelect}
                                />
                            </Breadcrumb.Item>
                            {!(index === items.length - 1) && (
                                <Breadcrumb.Separator color="gray.400">
                                    <LiaSlashSolid size={16} />
                                </Breadcrumb.Separator>
                            )}
                        </Fragment>
                    ))}
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </Box>
    );
};
