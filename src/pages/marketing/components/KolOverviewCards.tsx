
import { Card } from "@/components/ui/card";

const KolOverviewCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total KOLs</div>
            <div className="text-3xl font-bold">5</div>
            <div className="text-xs text-muted-foreground mt-1">4 active KOLs</div>
          </div>
          <div className="h-10 w-10 rounded-md bg-purple-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12H19M12 12C12 13.6569 10.6569 15 9 15C7.34315 15 6 13.6569 6 12C6 10.3431 7.34315 9 9 9C10.6569 9 12 10.3431 12 12ZM21 18H12M12 18C12 19.6569 10.6569 21 9 21C7.34315 21 6 19.6569 6 18C6 16.3431 7.34315 15 9 15C10.6569 15 12 16.3431 12 18ZM21 6H12M12 6C12 7.65685 10.6569 9 9 9C7.34315 9 6 7.65685 6 6C6 4.34315 7.34315 3 9 3C10.6569 3 12 4.34315 12 6Z" stroke="#9b87f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Active Projects</div>
            <div className="text-3xl font-bold">13</div>
            <div className="text-xs text-muted-foreground mt-1">Live campaigns</div>
          </div>
          <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64193 8.82547 5.99623L9.15316 5.40838Z" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Avg. Engagement</div>
            <div className="text-3xl font-bold">330%</div>
            <div className="text-xs text-muted-foreground mt-1">Across all platforms</div>
          </div>
          <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3M21 7L15.5657 12.4343C15.3677 12.6323 15.2687 12.7313 15.1545 12.7684C15.0541 12.8011 14.9459 12.8011 14.8455 12.7684C14.7313 12.7313 14.6323 12.6323 14.4343 12.4343L12.5657 10.5657C12.3677 10.3677 12.2687 10.2687 12.1545 10.2316C12.0541 10.1989 11.9459 10.1989 11.8455 10.2316C11.7313 10.2687 11.6323 10.3677 11.4343 10.5657L7 15M21 7H17M21 7V11" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
            <div className="text-3xl font-bold">Rp 234,500,000</div>
            <div className="text-xs text-muted-foreground mt-1">From all KOL campaigns</div>
          </div>
          <div className="h-10 w-10 rounded-md bg-orange-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.12153 12.3844L8.20206 12.3049M15.7522 5.84253C17.1764 7.26673 17.1764 9.56326 15.7522 10.9875C14.328 12.4117 12.0315 12.4117 10.6073 10.9875C9.18305 9.56326 9.18305 7.26673 10.6073 5.84253C12.0315 4.41833 14.328 4.41833 15.7522 5.84253Z" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.35465 15.3127L7.15796 18.5767C7.52833 18.9095 7.71352 19.0759 7.75388 19.28C7.78901 19.4563 7.74247 19.6389 7.62933 19.7831C7.49931 19.9484 7.25293 20.012 6.76017 20.1393L5.1336 20.5083C4.43684 20.6811 4.08846 20.7675 3.80724 20.6338C3.5623 20.518 3.38248 20.3007 3.30182 20.0341C3.20654 19.7222 3.356 19.3973 3.65494 18.7476L4.24759 17.1588C4.4738 16.4078 4.5869 16.0323 4.80845 15.7867C4.99485 15.5787 5.24234 15.4365 5.51533 15.3811C5.8281 15.3167 6.18754 15.4192 6.90644 15.6243L10.7428 16.7443C10.9626 16.8076 11.0726 16.8392 11.1825 16.8485C11.2792 16.8567 11.3767 16.8486 11.4701 16.8246C11.5768 16.7976 11.6787 16.7423 11.8825 16.6316L15.1702 14.843C16.0367 14.3615 16.47 14.1208 16.9232 14.0821C17.3243 14.0476 17.7242 14.1435 18.0643 14.3542C18.4493 14.5935 18.726 15.0212 19.2795 15.8765L21 18.5" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default KolOverviewCards;
