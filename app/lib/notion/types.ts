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

export type Notion30DayFeedback = {
  id: string;
  properties: {
    hiring_manager_name: {
      rich_text: {
        plain_text: string;
      }[];
    };
    contractor_name: {
      rich_text: {
        plain_text: string;
      }[];
    };
    date: {
      formula: {
        date: {
          start: string;
        };
      };
    };
    "How would you evaluate your developer’s performance overall?": {
      number: number;
    };
    Communication: {
      select: {
        name: string;
      };
    };
    Teamwork: {
      select: {
        name: string;
      };
    };
    Engagement: {
      select: {
        name: string;
      };
    };
    Comments: {
      title: {
        plain_text: string;
      }[];
    };
  };
};

export type Notion60DayFeedback = {
  id: string;
  properties: {
    hiring_manager_name: {
      rich_text: {
        plain_text: string;
      }[];
    };
    contractor_name: {
      rich_text: {
        plain_text: string;
      }[];
    };
    date: {
      formula: {
        date: {
          start: string;
        };
      };
    };
    "How would you evaluate your developer’s performance overall?": {
      number: number;
    };
    seniority: {
      number: number;
    };
    Communication: {
      select: {
        name: string;
      };
    };
    Teamwork: {
      select: {
        name: string;
      };
    };
    Proactiveness: {
      select: {
        name: string;
      };
    };
    Autonomy: {
      select: {
        name: string;
      };
    };
    Engagement: {
      select: {
        name: string;
      };
    };
    "Do you wish to add any comments or specific feedback?": {
      rich_text: {
        plain_text: string;
      }[];
    };
  };
};

export type Notion90to270DayFeedback = {
  id: string;
  properties: {
    hiring_manager_name: {
      rich_text: {
        plain_text: string;
      }[];
    };
    contractor_name: {
      rich_text: {
        plain_text: string;
      }[];
    };
    date: {
      formula: {
        date: {
          start: string;
        };
      };
    };
    "How satisfied are you with the hire you made?": {
      number: number;
    };
    "Including big picture mindset": {
      select: {
        name: string;
      };
    };
    "Participating in team discussions": {
      select: {
        name: string;
      };
    };
    "Building a growth plan for the future": {
      select: {
        name: string;
      };
    };
    "Receiving constructive feedback": {
      select: {
        name: string;
      };
    };
    "Do you wish to add any comments or specific feedback?": {
      title?: {
        plain_text: string;
      }[];
      rich_text?: {
        plain_text: string;
      }[];
    };
  };
};

export type NotionNote = {
  id: string;
  properties: {
    customer: {
      title: {
        plain_text: string;
      }[];
    };
    note: {
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
  };
};

export type NotionUser = {
  id: string;
  properties: {
    email: {
      email: string;
    };
    name: {
      title: {
        plain_text: string;
      }[];
    };
    role: {
      rich_text: {
        plain_text: string;
      }[];
    };
    customerId: {
      number: number;
    };
    password: {
      rich_text: {
        plain_text: string;
      }[];
    };
  };
};
