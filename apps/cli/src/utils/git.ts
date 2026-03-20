import { simpleGit, SimpleGit } from "simple-git";
import path from "node:path";

export interface GitMetadata {
    lastModifiedDate?: Date;
    authors: string[];
}

/**
 * Gets git metadata (all authors, last modified date) for a set of files.
 * Uses native git via simple-git to follow renames and handle worktrees.
 */
export async function getGitMetadataForFiles(
    sourceDirectory: string,
    files: string[],
    ref?: string
): Promise<GitMetadata> {
    const authors = new Set<string>();
    let lastModifiedDate: Date | undefined;

    try {
        const git: SimpleGit = simpleGit(sourceDirectory);

        // Ensure we are in a git repository
        if (!(await git.checkIsRepo())) {
            return { authors: [], lastModifiedDate: undefined };
        }

        // Determine the branch to look at.
        // If ref is provided, we use it, otherwise we use the current branch context.
        const branchContext =
            ref || (await git.revparse(["--abbrev-ref", "HEAD"]));

        for (const file of files) {
            // file is absolute or relative to sourceDirectory
            const relativePath = path.isAbsolute(file)
                ? path.relative(sourceDirectory, file).replace(/\\/g, "/")
                : file.replace(/\\/g, "/");

            try {
                // git log --follow --format=... [branch] -- [file]
                const log = await git.log({
                    file: relativePath,
                    [branchContext]: null,
                    "--follow": null,
                });

                for (const commit of log.all) {
                    if (commit.author_name) {
                        authors.add(commit.author_name);
                    }

                    const date = new Date(commit.date);
                    if (!lastModifiedDate || date > lastModifiedDate) {
                        lastModifiedDate = date;
                    }
                }
            } catch (err) {
                // File might not have history in this branch or at this path
                // continue to next file
            }
        }
    } catch (err) {
        // Critical git error or not in project with git installed
    }

    return {
        lastModifiedDate,
        authors: Array.from(authors),
    };
}
