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
import { ReactNode } from "react";

export interface BreadcrumbOption {
    label: string;
    value: string;
}

export interface BreadcrumbItem {
    label: string;
    subtitle?: string;
    icon?: (size: number) => ReactNode;
    options?: BreadcrumbOption[];
    onClick?: () => void;
    onSelect?: (value: string) => void;
}

export interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    showSubtitle?: boolean;
}

const BreadcrumbItemContent = ({
    item,
    showSubtitle = true,
}: {
    item: BreadcrumbItem;
    showSubtitle?: boolean;
}) => (
    <Box display={"flex"} flexDirection={"row"} gap={2}>
        {item.icon && item.icon(showSubtitle ? 24 : 16)}
        <Box display={"flex"} flexDirection={"column"} gap={0}>
            {item.subtitle && showSubtitle && (
                <Box
                    as="span"
                    fontSize="10px"
                    color="gray.500"
                    lineHeight="1"
                    textTransform="uppercase"
                    fontWeight="bold"
                >
                    {item.subtitle}
                </Box>
            )}
            <Box as="span" fontSize="sm" lineHeight="1.2">
                {item.label}
            </Box>
        </Box>
    </Box>
);

export const Breadcrumbs = ({
    items,
    showSubtitle = true,
}: BreadcrumbsProps) => {
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
                                            height="auto"
                                            display="flex"
                                            alignItems="center"
                                            gap="1"
                                            _hover={{
                                                color: "white",
                                                textDecoration: "none",
                                            }}
                                            cursor="pointer"
                                        >
                                            <BreadcrumbItemContent
                                                item={item}
                                                showSubtitle={showSubtitle}
                                            />
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
                                    _hover={{ textDecoration: "none" }}
                                    height="auto"
                                >
                                    <BreadcrumbItemContent
                                        item={item}
                                        showSubtitle={showSubtitle}
                                    />
                                </Breadcrumb.CurrentLink>
                            ) : (
                                <Breadcrumb.Link
                                    onClick={item.onClick}
                                    color="gray.400"
                                    height="auto"
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
                                    <BreadcrumbItemContent
                                        item={item}
                                        showSubtitle={showSubtitle}
                                    />
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
