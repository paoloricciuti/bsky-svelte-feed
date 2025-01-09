PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`uri` text,
	`cid` text,
	`indexedAt` text,
	`text` text,
	`claude_answer` text,
	`confirmed` integer DEFAULT true,
	`reported` integer DEFAULT false
);
--> statement-breakpoint
INSERT INTO `__new_posts`("uri", "cid", "indexedAt", "text", "claude_answer", "confirmed", "reported") SELECT "uri", "cid", "indexedAt", "text", "claude_answer", "confirmed", "reported" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;