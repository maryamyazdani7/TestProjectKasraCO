using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using TestProjectKasraCO.Models;

namespace TestProjectKasraCO.App_Data
{
    public class DatabaseAccess
    {
        private SqlConnection sqlConnection = new SqlConnection();
        private SqlCommand sqlCommand = new SqlCommand();
        private SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
        private DataTable dataTable = new DataTable();

        public DatabaseAccess()
        {
            sqlConnection.ConnectionString = ConfigurationManager.ConnectionStrings["KasraConnection"].ConnectionString;
            sqlCommand.Connection = sqlConnection;
            sqlCommand.Parameters.Clear();
            sqlDataAdapter.SelectCommand = sqlCommand;
        }

        public List<User> UsersList()
        {
            try
            {
                sqlCommand.CommandType = CommandType.Text;
                sqlCommand.CommandText = "select * from dbo.fnUsersList()";

                sqlConnection.Open();
                dataTable = new DataTable();
                sqlDataAdapter.Fill(dataTable);

                return (dataTable.AsEnumerable()
                       .Select(x => new User
                       {
                           Id = x.Field<Int32>("Id"),
                           FirstName = x.Field<string>("FirstName"),
                           LastName = x.Field<string>("LastName"),
                           
                       }).ToList());
            }
            catch (Exception ex) { throw ex; }
            finally { sqlConnection.Close(); }
        }
         public List<TrafficViewModel> TrafficList()
        {
            try
            {
                sqlCommand.CommandType = CommandType.Text;
                sqlCommand.CommandText = "select * from dbo.fnTrafficList()";

                sqlConnection.Open();
                dataTable = new DataTable();
                sqlDataAdapter.Fill(dataTable);

                return (dataTable.AsEnumerable()
                       .Select(x => new TrafficViewModel
                       {
                           Id = x.Field<Int32>("Id"),
                           RegDate = PersianDate.ConvertDate.ToFa(x.Field<DateTime>("RegDate")),
                           UserId = x.Field<Int32>("UserId"),
                           UserName = x.Field<string>("UserName"),
                           OutDate = (x.Field<DateTime?>("OutDate") != null ? PersianDate.ConvertDate.ToFaWithTime(x.Field<DateTime>("OutDate")) : null),
                           InDate = (x.Field<DateTime?>("InDate") != null ? PersianDate.ConvertDate.ToFaWithTime(x.Field<DateTime>("InDate")) : null)
                       }).ToList());
            }
            catch (Exception ex) { throw ex; }
            finally { sqlConnection.Close(); }
        }
        public Int32 TrafficInsertEdit(Traffic traffic, bool isEdit)
        {
            try
            {
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.CommandText = "prTrafficInsertEdit";
                sqlCommand.Parameters.Clear();
                sqlCommand.Parameters.Add("@IsEdit", SqlDbType.Bit).Value = isEdit;
                if(isEdit) sqlCommand.Parameters.Add("@Id", SqlDbType.Int).Value = traffic.Id;
                sqlCommand.Parameters.Add("@UserId", SqlDbType.Int).Value = traffic.UserId;
                sqlCommand.Parameters.Add("@UserName", SqlDbType.NVarChar).Value = traffic.UserName;
                if(traffic.OutDate != null) sqlCommand.Parameters.Add("@OutDate", SqlDbType.DateTime).Value = traffic.OutDate;
                if (traffic.InDate != null) sqlCommand.Parameters.Add("@InDate", SqlDbType.DateTime).Value = traffic.InDate;
                sqlCommand.Parameters.Add("@Result", SqlDbType.Int).Direction = ParameterDirection.ReturnValue;

                sqlConnection.Open();
                sqlCommand.ExecuteNonQuery();

                return ((Int32)sqlCommand.Parameters["@Result"].Value);
            }
            catch (Exception ex) { throw ex; }
            finally { sqlConnection.Close(); }
        }
        public Int32 TrafficDelete(Int32 Id)
        {
            try
            {
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.CommandText = "prTrafficDelete";
                sqlCommand.Parameters.Clear();
                sqlCommand.Parameters.Add("@Id", SqlDbType.Int).Value = Id;
                sqlCommand.Parameters.Add("@Result", SqlDbType.Int).Direction = ParameterDirection.ReturnValue;

                sqlConnection.Open();
                sqlCommand.ExecuteNonQuery();

                return ((Int32)sqlCommand.Parameters["@Result"].Value);
            }
            catch (Exception ex) { throw ex; }
            finally { sqlConnection.Close(); }
        }
        public List<TrafficViewModel> TrafficSearch(Traffic traffic)
        {
            try
            {
                sqlCommand.CommandType = CommandType.StoredProcedure;
                sqlCommand.CommandText = "prTrafficSearch";
                sqlCommand.Parameters.Clear();
                if (traffic.UserId != 0) sqlCommand.Parameters.Add("@UserId", SqlDbType.Int).Value = traffic.UserId;
                if (traffic.OutDate != null) sqlCommand.Parameters.Add("@OutDate", SqlDbType.DateTime).Value = traffic.OutDate;
                if (traffic.InDate != null) sqlCommand.Parameters.Add("@InDate", SqlDbType.DateTime).Value = traffic.InDate;

                sqlCommand.Parameters.Add("@Result", SqlDbType.Int).Direction = ParameterDirection.ReturnValue;

                sqlConnection.Open();
                dataTable = new DataTable();
                sqlDataAdapter.Fill(dataTable);

                return (dataTable.AsEnumerable()
                      .Select(x => new TrafficViewModel
                      {
                          Id = x.Field<Int32>("Id"),
                          RegDate = PersianDate.ConvertDate.ToFa(x.Field<DateTime>("RegDate")),
                          UserId = x.Field<Int32>("UserId"),
                          UserName = x.Field<string>("UserName"),
                          OutDate = (x.Field<DateTime?>("OutDate") != null ? PersianDate.ConvertDate.ToFaWithTime(x.Field<DateTime>("OutDate")) : null),
                          InDate = (x.Field<DateTime?>("InDate") != null ? PersianDate.ConvertDate.ToFaWithTime(x.Field<DateTime>("InDate")) : null)
                      }).ToList());
            }
            catch (Exception ex) { throw ex; }
            finally { sqlConnection.Close(); }
        }
         public TrafficViewModel TrafficDetail(Int32 Id)
        {
            try
            {
                sqlCommand.CommandType = CommandType.Text;
                sqlCommand.CommandText = "select * from dbo.fnTrafficDetail("+ Id +")";

                sqlConnection.Open();
                dataTable = new DataTable();
                sqlDataAdapter.Fill(dataTable);

                return (dataTable.AsEnumerable()
                      .Select(x => new TrafficViewModel
                      {
                          Id = x.Field<Int32>("Id"),
                          RegDate = PersianDate.ConvertDate.ToFa(x.Field<DateTime>("RegDate")),
                          UserId = x.Field<Int32>("UserId"),
                          UserName = x.Field<string>("UserName"),
                          OutDate = (x.Field<DateTime?>("OutDate") != null ? PersianDate.ConvertDate.ToFaWithTime(x.Field<DateTime>("OutDate")) : null),
                          InDate = (x.Field<DateTime?>("InDate") != null ? PersianDate.ConvertDate.ToFaWithTime(x.Field<DateTime>("InDate")) : null)
                      }).FirstOrDefault());
            }
            catch (Exception ex) { throw ex; }
            finally { sqlConnection.Close(); }
        }

    }
}