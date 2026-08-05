const API_BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function mapService(s) {
  return {
    id: s.id,
    name: s.nome,
    description: s.descricao,
    duration_min: s.duracaoMinutos,
    price: Number(s.preco),
    icon: s.icon || 'Sparkles',
    category: s.categoria?.nome || '',
    ativo: s.ativo,
  };
}

function mapProfessional(p) {
  const u = p.usuario || {};
  const name = u.nome || p.nome || '';
  const initials = name.split(' ').map((w) => w[0]).join('').substring(0, 2).toUpperCase();
  return {
    id: p.id,
    name,
    initials,
    specialty: p.especialidades || '',
    rating: Number(p.rating || 4.8),
    reviews: Number(p.reviews || 12),
    ativo: p.ativo,
  };
}

function mapAppointment(a) {
  return {
    id: a.id,
    client_name: a.cliente?.usuario?.nome || a.clienteNome || '',
    client_email: a.cliente?.usuario?.email || a.clienteEmail || '',
    client_phone: a.cliente?.telefone || a.clienteTelefone || '',
    service_name: a.servico?.nome || a.servicoNome || '',
    professional_name: a.profissional?.usuario?.nome || a.profissionalNome || '',
    date: a.data || '',
    time: a.horaInicio || '',
    duration_min: a.servico?.duracaoMinutos || 60,
    status: a.status?.toLowerCase() || 'pending',
    payment_method: a.formaPagamento?.toLowerCase() || 'pix',
    total_price: Number(a.valorTotal || 0),
    created_date: a.createdAt || a.criadoEm || '',
  };
}

function mapSchedule(s) {
  return {
    id: s.id,
    professional_name: s.profissional?.usuario?.nome || s.profissionalNome || '',
    days_off: s.diasFolga || '',
    slots_sun: s.domingo || '',
    slots_mon: s.segunda || '',
    slots_tue: s.terca || '',
    slots_wed: s.quarta || '',
    slots_thu: s.quinta || '',
    slots_fri: s.sexta || '',
    slots_sat: s.sabado || '',
  };
}

function mapReview(r) {
  return {
    id: r.id,
    client_name: r.clienteNome || '',
    rating: Number(r.nota || 5),
    comment: r.comentario || '',
    service_name: r.servicoNome || '',
    created_date: r.createdAt || r.criadoEm || '',
  };
}

function mapLoyaltyCard(c) {
  return {
    id: c.id,
    client_email: c.clienteEmail || '',
    client_name: c.clienteNome || '',
    points: Number(c.pontos || 0),
    visits: Number(c.visitas || 0),
    total_spent: Number(c.totalGasto || 0),
    tier: c.nivel || 'bronze',
  };
}

const Service = {
  async list(sort, limit) {
    const params = new URLSearchParams();
    if (sort) params.set('sort', sort);
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    const data = await request(`/servicos${qs ? '?' + qs : ''}`);
    return (data.servicos || []).map(mapService);
  },
  async create(d) {
    const data = await request('/servicos', {
      method: 'POST',
      body: JSON.stringify({
        nome: d.name,
        descricao: d.description,
        duracaoMinutos: d.duration_min,
        preco: d.price,
        icon: d.icon,
        categoria: d.category,
      }),
    });
    return mapService(data.servico || data);
  },
  async update(id, d) {
    const data = await request(`/servicos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nome: d.name,
        descricao: d.description,
        duracaoMinutos: d.duration_min,
        preco: d.price,
        icon: d.icon,
        categoria: d.category,
      }),
    });
    return mapService(data.servico || data);
  },
  async delete(id) {
    await request(`/servicos/${id}`, { method: 'DELETE' });
  },
};

const Professional = {
  async list(sort, limit) {
    const params = new URLSearchParams();
    if (sort) params.set('sort', sort);
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    const data = await request(`/profissionais${qs ? '?' + qs : ''}`);
    return (data.profissionais || []).map(mapProfessional);
  },
  async create(d) {
    const data = await request('/profissionais', {
      method: 'POST',
      body: JSON.stringify({
        nome: d.name,
        especialidades: d.specialty,
        rating: d.rating,
        reviews: d.reviews,
      }),
    });
    return mapProfessional(data.profissional || data);
  },
  async update(id, d) {
    const data = await request(`/profissionais/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nome: d.name,
        especialidades: d.specialty,
        rating: d.rating,
        reviews: d.reviews,
      }),
    });
    return mapProfessional(data.profissional || data);
  },
  async delete(id) {
    await request(`/profissionais/${id}`, { method: 'DELETE' });
  },
};

const Appointment = {
  async list(sort, limit) {
    const params = new URLSearchParams();
    if (sort) params.set('sort', sort);
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    const data = await request(`/appointments${qs ? '?' + qs : ''}`);
    return (data.appointments || []).map(mapAppointment);
  },
  async filter(filters) {
    const params = new URLSearchParams();
    if (filters.date) params.set('data', filters.date);
    if (filters.status) params.set('status', filters.status);
    if (filters.professional_name) params.set('profissionalNome', filters.professional_name);
    const qs = params.toString();
    const data = await request(`/appointments${qs ? '?' + qs : ''}`);
    return (data.appointments || []).map(mapAppointment);
  },
  async create(d) {
    const data = await request('/appointments', {
      method: 'POST',
      body: JSON.stringify({
        clientName: d.client_name,
        clientEmail: d.client_email,
        clientPhone: d.client_phone,
        serviceName: d.service_name,
        professionalName: d.professional_name,
        date: d.date,
        time: d.time,
        durationMin: d.duration_min,
        status: d.status,
        paymentMethod: d.payment_method,
        totalPrice: d.total_price,
      }),
    });
    return mapAppointment(data.appointment || data);
  },
  async update(id, d) {
    const data = await request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        clientName: d.client_name,
        clientEmail: d.client_email,
        clientPhone: d.client_phone,
        serviceName: d.service_name,
        professionalName: d.professional_name,
        date: d.date,
        time: d.time,
        status: d.status,
        paymentMethod: d.payment_method,
        totalPrice: d.total_price,
      }),
    });
    return mapAppointment(data.appointment || data);
  },
  async delete(id) {
    await request(`/appointments/${id}`, { method: 'DELETE' });
  },
};

const Schedule = {
  async filter(filters) {
    const params = new URLSearchParams();
    if (filters.professional_name) params.set('profissionalNome', filters.professional_name);
    const qs = params.toString();
    const data = await request(`/schedules${qs ? '?' + qs : ''}`);
    return (data.schedules || []).map(mapSchedule);
  },
  async create(d) {
    const data = await request('/schedules', {
      method: 'POST',
      body: JSON.stringify({
        professionalName: d.professional_name,
        daysOff: d.days_off,
        domingo: d.slots_sun,
        segunda: d.slots_mon,
        terca: d.slots_tue,
        quarta: d.slots_wed,
        quinta: d.slots_thu,
        sexta: d.slots_fri,
        sabado: d.slots_sat,
      }),
    });
    return mapSchedule(data.schedule || data);
  },
  async update(id, d) {
    const data = await request(`/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        professionalName: d.professional_name,
        daysOff: d.days_off,
        domingo: d.slots_sun,
        segunda: d.slots_mon,
        terca: d.slots_tue,
        quarta: d.slots_wed,
        quinta: d.slots_thu,
        sexta: d.slots_fri,
        sabado: d.slots_sat,
      }),
    });
    return mapSchedule(data.schedule || data);
  },
};

const Review = {
  async list(sort, limit) {
    const params = new URLSearchParams();
    if (sort) params.set('sort', sort);
    if (limit) params.set('limit', String(limit));
    const qs = params.toString();
    const data = await request(`/reviews${qs ? '?' + qs : ''}`);
    return (data.reviews || []).map(mapReview);
  },
  async create(d) {
    const data = await request('/reviews', {
      method: 'POST',
      body: JSON.stringify({
        clientName: d.client_name,
        rating: d.rating,
        comment: d.comment,
        serviceName: d.service_name,
      }),
    });
    return mapReview(data.review || data);
  },
};

const LoyaltyCard = {
  async filter(filters) {
    const params = new URLSearchParams();
    if (filters.client_email) params.set('clienteEmail', filters.client_email);
    const qs = params.toString();
    const data = await request(`/loyalty-cards${qs ? '?' + qs : ''}`);
    return (data.cards || []).map(mapLoyaltyCard);
  },
  async create(d) {
    const data = await request('/loyalty-cards', {
      method: 'POST',
      body: JSON.stringify({
        clienteEmail: d.client_email,
        clientName: d.client_name,
        pontos: d.points,
        visitas: d.visits,
        totalGasto: d.total_spent,
        nivel: d.tier,
      }),
    });
    return mapLoyaltyCard(data.card || data);
  },
  async update(id, d) {
    const data = await request(`/loyalty-cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        pontos: d.points,
        visitas: d.visits,
        totalGasto: d.total_spent,
        nivel: d.tier,
      }),
    });
    return mapLoyaltyCard(data.card || data);
  },
};

export const api = { Service, Professional, Appointment, Schedule, Review, LoyaltyCard };
