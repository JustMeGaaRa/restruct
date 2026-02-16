import { Breadcrumb, Box } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

export interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
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
                        return (
                            <Breadcrumb.Item key={index}>
                                {isLast ? (
                                    <Breadcrumb.CurrentLink
                                        color="white"
                                        fontSize="sm"
                                        _hover={{
                                            textDecoration: "none",
                                        }}
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
                                )}
                                {!isLast && (
                                    <Breadcrumb.Separator
                                        color="gray.500"
                                        px={1}
                                    >
                                        <LuChevronRight />
                                    </Breadcrumb.Separator>
                                )}
                            </Breadcrumb.Item>
                        );
                    })}
                </Breadcrumb.List>
            </Breadcrumb.Root>
        </Box>
    );
};
