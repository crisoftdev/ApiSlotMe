import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
    async crearPreferenciaDelVendedor(accessToken: string, data: any) {
        const client = new MercadoPagoConfig({ accessToken });

        const preference = new Preference(client);

        const preferenceData = {
            items: [
                {
                    title: data.title || 'Producto',
                    unit_price: Number(data.unit_price) || 100,
                    quantity: Number(data.quantity) || 1,
                },
            ],
            back_urls: {
                success: 'https://www.tusitio.com/success',
                failure: 'https://www.tusitio.com/failure',
                pending: 'https://www.tusitio.com/pending',
            },
            auto_return: 'approved',
        };

        const response = await (preference as any).create(preferenceData);

        return response;
    }
}
