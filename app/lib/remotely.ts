const headers = new Headers();
headers.append("authorization", `Bearer ${process.env.REMOTELY_API_KEY}`);
headers.append("content-type", "application/json");

const REMOTELY_API_URL = "https://platform.remotely.works/api/v1";

type Tag = {
  name: string;
};

const getCustomer = async (customerId: number) => {
  const response = await fetch(
    `${REMOTELY_API_URL}/admin/backoffice/customers/${customerId}`,
    {
      method: "GET",
      headers,
    },
  ).then((response) => response.json());
  return response.status === 200 ? response.result : null;
};

const getTagDetails = async (tagId: string): Promise<Tag> => {
  const result = await fetch(
    `${REMOTELY_API_URL}/admin/backoffice/tags/${tagId}`,
    {
      method: "GET",
      headers,
    },
  ).then((response) => response.json());
  return result.status === 200 ? result.result : Promise.reject();
};

const generateCustomersDetails = async (customerId: number) => {
  const customer = await getCustomer(customerId);
  if (!customer) {
    return { result: "Customer was not found", customer: null };
  }
  const industryPromise = customer.sectors.map((tagId: string) =>
    getTagDetails(tagId),
  );
  const techStackPromise = customer.tags.map((tagId: string) =>
    getTagDetails(tagId),
  );

  const industry = (await Promise.all(industryPromise)).map(
    (result: Tag) => result.name,
  );
  const techStack = (await Promise.all(techStackPromise)).map(
    (result: Tag) => result.name,
  );

  const result = `# Customer details for ${customer.company_name}

Address: ${customer.address.address.join(", ")}

City: ${customer.address.city}

Region: ${customer.address.region}

Country: ${customer.address.country}

Industry: ${industry.join(", ")}

Tech Stack: ${techStack.join(", ")}

Description: ${customer.description}`;

  return { result, customer };
};

export { getCustomer, generateCustomersDetails };
