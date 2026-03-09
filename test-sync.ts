import { SyncService } from './lib/sync-service';

async function main() {
    console.log("Starting Sync Products...");
    await SyncService.syncProducts();
    console.log("Finished Sync Products");
    process.exit(0);
}

main().catch(console.error);
