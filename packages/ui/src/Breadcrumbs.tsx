import {
    Breadcrumb,
    Box,
    MenuRoot,
    MenuTrigger,
    MenuContent,
    MenuItem,
    Portal,
    Menu,
} from "@chakra-ui/react";
import { LuChevronRight, LuChevronDown } from "react-icons/lu";
import { Fragment } from "react/jsx-runtime";

export interface BreadcrumbOption {
    label: string;
    value: string;
}

export interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
    options?: BreadcrumbOption[];
    onSelect?: (value: string) => void;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

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
            px="4"
            py="1"
            border="1px solid"
            borderColor="whiteAlpha.200"
            boxShadow="0 4px 20px rgba(0, 0, 0, 0.4)"
            zIndex={1000}
        >
            <Breadcrumb.Root>
                <Breadcrumb.List>
                    {items.map((item, index) => {
                        const isLast = index === items.length - 1;

                        let CustomLink = null;
                        if (item.options && item.options.length > 0) {
                            CustomLink = (
                                <MenuRoot>
                                    <MenuTrigger asChild>
                                        <Breadcrumb.Link
                                            color={
                                                isLast ? "white" : "gray.400"
                                            }
                                            fontSize="sm"
                                            height="32px"
                                            display="flex"
                                            alignItems="center"
                                            gap="1"
                                            _hover={{
                                                color: "white",
                                                textDecoration: "none",
                                            }}
                                            cursor="pointer"
                                        >
                                            {item.label}
                                            <LuChevronDown size="14" />
                                        </Breadcrumb.Link>
                                    </MenuTrigger>
                                    <Portal>
                                        <Menu.Positioner>
                                            <MenuContent
                                                bg="neutral.900"
                                                border="1px solid"
                                                borderColor="whiteAlpha.200"
                                                zIndex={1001}
                                            >
                                                {item.options.map((option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        value={option.value}
                                                        onClick={() =>
                                                            item.onSelect?.(
                                                                option.value
                                                            )
                                                        }
                                                        _hover={{
                                                            bg: "whiteAlpha.200",
                                                        }}
                                                        color="white"
                                                    >
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </MenuContent>
                                        </Menu.Positioner>
                                    </Portal>
                                </MenuRoot>
                            );
                        } else {
                            CustomLink = isLast ? (
                                <Breadcrumb.CurrentLink
                                    color="white"
                                    fontSize="sm"
                                    _hover={{ textDecoration: "none" }}
                                >
                                    {item.label}
                                </Breadcrumb.CurrentLink>
                            ) : (
                                <Breadcrumb.Link
                                    onClick={item.onClick}
                                    color="gray.400"
                                    fontSize="sm"
                                    height="32px"
                                    _hover={{
                                        color: "white",
                                        textDecoration: "none",
                                    }}
                                    cursor={
                                        item.onClick ? "pointer" : "default"
                                    }
                                    pointerEvents={
                                        item.onClick ? "auto" : "none"
                                    }
                                >
                                    {item.label}
                                </Breadcrumb.Link>
                            );
                        }

                        return (
                            <Fragment key={index}>
                                <Breadcrumb.Item>{CustomLink}</Breadcrumb.Item>
                                {!isLast && (
                                    <Breadcrumb.Separator
                                        color="gray.500"
                                        px={1}
                                    >
                                        <LuChevronRight />
                                    </Breadcrumb.Separator>
                                )}
                            </Fragment>
                        );
                    })}
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </Box>
    );
};
