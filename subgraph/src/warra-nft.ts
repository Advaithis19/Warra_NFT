import { activityOnTokenCalled as activityOnTokenCalledEvent } from "../generated/Warra_NFT/Warra_NFT";
import { Activity } from "../generated/schema";

export function handleactivityOnTokenCalled(
  event: activityOnTokenCalledEvent
): void {
  let entity = new Activity(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  entity.tokenId = event.params.tokenId;
  entity.tokenUri = event.params.tokenUri;
  entity.activity = event.params.activity;
  entity.caller = event.params.caller;
  entity.associated = event.params.associated;
  entity.timestamp = event.params.timestamp;
  entity.save();
}
