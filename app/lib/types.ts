export type NormalizedCheckin = {
  checkinType: "Interview" | "Async videoask";
  remoter: string;
  instance: string;
  manager: string;
  date: string;
  tone?: string;
  summary: string;
  quote?: string;
};

export type NotionAsyncCheckin = {
  id: string;
  properties: {
    Name: {
      title: {
        plain_text: string;
      }[];
    };
    instance: {
      number: number;
    };
    "manager name": {
      rich_text: {
        plain_text: string;
      }[];
    };
    date: {
      date: {
        start: string;
      };
    };
    tone: {
      select: {
        name: string;
      };
    };
    sumarization: {
      rich_text: {
        plain_text: string;
      }[];
    };
    quote: {
      rich_text: {
        plain_text: string;
      }[];
    };
  };
};

export type NotionSyncCheckin = {
  id: string;
  properties: {
    Name: {
      title: {
        plain_text: string;
      }[];
    };
    instance: {
      number: number;
    };
    "manager name": {
      rich_text: {
        plain_text: string;
      }[];
    };
    date: {
      date: {
        start: string;
      };
    };
    sumarization: {
      rich_text: {
        plain_text: string;
      }[];
    };
  };
};
