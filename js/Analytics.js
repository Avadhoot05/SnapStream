class Analytics
{

    static async GetOrCreateClientId() 
    {
        const result = await chrome.storage.local.get('clientId');
        
        let clientId = result.clientId;
        if (!clientId) 
        {
            clientId = self.crypto.randomUUID();
            await chrome.storage.local.set({clientId});
        }
        return clientId;
    }

    static async SendEvent(eventId, btnId)
    {
        const strUrl = `${GA_ENDPOINT}?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`; 
        const options = {
            method: 'POST',
            body: JSON.stringify({
              client_id: await this.GetOrCreateClientId(),
              events: [
                {
                  name: eventId,
                  params: {
                    id: btnId,
                  },
                },
              ],
            }),
          };

        fetch(strUrl, options)
        .then(res => {
            console.log("Response from GA4", res);
        })
        .catch(e => {
            console.log("Error from GA4", e);
        });
    }

}