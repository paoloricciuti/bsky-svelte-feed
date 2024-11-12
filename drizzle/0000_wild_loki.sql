CREATE TABLE `posts` (
	`uri` text,
	`cid` text,
	`indexedAt` text
);
--> statement-breakpoint
CREATE TABLE `sub_state` (
	`service` text,
	`cursor` integer
);
